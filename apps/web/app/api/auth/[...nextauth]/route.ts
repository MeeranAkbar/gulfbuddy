import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

import { prisma } from "../../../../lib/prisma"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Find user in database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          // If no user exists, let's create a mock one for demo purposes if it's "test@test.com"
          if (credentials.email === "test@test.com" && credentials.password === "password") {
            const newUser = await prisma.user.create({
              data: {
                email: "test@test.com",
                name: "Test User",
                plan: "FREE"
              }
            })
            return { id: newUser.id, email: newUser.email, name: newUser.name, plan: newUser.plan }
          }
          return null
        }

        // In a real app, we would verify password hash here
        // const isValid = await bcrypt.compare(credentials.password, user.password)
        // For our prototype, any password works if the email exists

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
        // Fetch fresh plan from database
        const user = await prisma.user.findUnique({
          where: { id: token.sub }
        })
        if (user) {
          session.user.plan = user.plan
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    }
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "supersecretkey123",
})

export { handler as GET, handler as POST }
