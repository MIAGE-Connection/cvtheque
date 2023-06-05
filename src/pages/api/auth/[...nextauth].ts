import NextAuth, { NextAuthOptions } from 'next-auth'
import { AppProviders } from 'next-auth/providers'
import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import EmailProvider from 'next-auth/providers/email'

import { prisma } from 'server/prisma'

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
          }
          return user
        }
        return null
      },
      credentials: {
        name: { type: 'test' },
      },
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
        } as any
      },
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      maxAge: 24 * 60 * 60,
    }),
  )
}

export const authOptions: NextAuthOptions = {
  providers,
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
            name: user.name,
          },
        })
      }

      return true
    },
    async redirect({ baseUrl }) {
      return baseUrl
    },
  },
}

export default NextAuth(authOptions)
