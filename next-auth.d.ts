import 'next-auth/jwt'
import { DefaultSession } from 'next-auth'
import { Role } from '@prisma/client'

declare module 'next-auth/jwt' {
  interface JWT {
    role: Role
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      role: Role
      email: string
    } & DefaultSession['user']
  }

  interface User {
    role: Role
  }
}
