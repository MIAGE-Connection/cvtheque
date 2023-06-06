import { PrismaAdapter } from '@next-auth/prisma-adapter'
import NextAuth, { NextAuthOptions } from 'next-auth'
import { AppProviders } from 'next-auth/providers'
import EmailProvider from 'next-auth/providers/email'
import GithubProvider from 'next-auth/providers/github'
import prisma from 'server/prisma'

let useMockProvider = process.env.NODE_ENV === 'test'
const { GITHUB_CLIENT_ID, GITHUB_SECRET, NODE_ENV, APP_ENV, NEXTAUTH_SECRET } =
  process.env
if (
  (NODE_ENV !== 'production' || APP_ENV === 'test') &&
  (!GITHUB_CLIENT_ID || !GITHUB_SECRET)
) {
  console.log('⚠️ Using mocked GitHub auth correct credentials were not added')
  useMockProvider = true
}
const providers: AppProviders = []

const adapter = PrismaAdapter(prisma)

adapter.createVerificationToken = async ({ token, identifier, expires }) => {
  const verificationToken = await prisma.verificationRequest.create({
    data: {
      identifier,
      token,
      expires,
      createdAt: new Date(),
    },
  })

  return verificationToken
}

adapter.useVerificationToken = async ({ token, identifier }) => {
  const verificationToken = await prisma.verificationRequest.findUnique({
    where: {
      identifier_token: { identifier, token },
    },
  })

  await prisma.verificationRequest.delete({
    where: {
      identifier_token: { identifier, token },
    },
  })

  return verificationToken
}

if (useMockProvider) {
  providers.push(
    /* CredentialsProvider({
      id: 'github',
      name: 'Mocked GitHub',
      async authorize(credentials) {
        if (credentials) {
          const user = {
            id: credentials.name,
            name: credentials.name,
            email: credentials.name,
            role: 'ADMIN' as Role,
          }
          return user
        }
        return null
      },
      credentials: {
        name: { type: 'test' },
      },
    }), */
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      from: process.env.SMTP_FROM,
      maxAge: 24 * 60 * 60,
    }),
  )
} else {
  if (!GITHUB_CLIENT_ID || !GITHUB_SECRET) {
    throw new Error('GITHUB_CLIENT_ID and GITHUB_SECRET must be set')
  }
  providers.push(
    GithubProvider({
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_SECRET,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: 'ADMIN',
        } as any
      },
    }),
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      from: process.env.SMTP_FROM,
      maxAge: 24 * 60 * 60,
    }),
  )
}

export const authOptions: NextAuthOptions = {
  providers,
  //adapter: PrismaAdapter(prisma),
  adapter: adapter,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        return false
      }

      const dbUser = await prisma.user.findUnique({ where: { email: user.email } })

      if (!dbUser) {
        await prisma.user.create({
          data: {
            email: user.email,
            name: '',
          },
        })
      }

      return true
    },
    jwt: async ({ token, user }) => {
      if (user) {
        /*
         * For adding custom parameters to user in session, we first need to add those parameters
         * in token which then will be available in the `session()` callback
         */
        const email = user.email as string
        const dbUser = await prisma.user.findUnique({ where: { email } })

        if (!dbUser) {
          throw new Error('User not found')
        }

        token.user = user
        token.role = dbUser.role
      }
      return token
    },
    session: async ({ session, token }) => {
      if (session.user) {
        // ** Add custom params to user in session which are added in `jwt()` callback via `token` parameter
        session.user.role = token.role
      }

      return session
    },
    async redirect({ baseUrl }) {
      return baseUrl
    },
  },
}

export default NextAuth(authOptions)
