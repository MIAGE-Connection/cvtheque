import { PrismaAdapter } from '@next-auth/prisma-adapter'
import NextAuth, { NextAuthOptions } from 'next-auth'
import { AppProviders } from 'next-auth/providers'
import EmailProvider from 'next-auth/providers/email'
import GithubProvider from 'next-auth/providers/github'
import { prisma } from 'server/prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import { Role } from '@prisma/client'

let useMockProvider = process.env.NODE_ENV === 'test'
const {
  GITHUB_CLIENT_ID,
  GITHUB_SECRET,
  NODE_ENV,
  APP_ENV,
  NEXTAUTH_SECRET,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASSWORD,
  SMTP_FROM,
} = process.env

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
    CredentialsProvider({
      id: 'github',
      name: 'Mocked GitHub',
      async authorize(credentials) {
        if (credentials) {
          const user = {
            id: credentials.name,
            name: credentials.name,
            email: credentials.name,
            role: Role.USER,
          }
          return user
        }
        return null
      },
      credentials: {
        name: { type: 'test' },
      },
    }),
    EmailProvider({
      server: {
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASSWORD,
        },
      },
      from: SMTP_FROM,
      maxAge: 24 * 60 * 60,
    }),
  )
} else {
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM) {
    throw new Error('GITHUB_CLIENT_ID and GITHUB_SECRET must be set')
  }
  providers.push(
    EmailProvider({
      server: {
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASSWORD,
        },
      },
      from: SMTP_FROM,
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
