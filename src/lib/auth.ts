import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import type { User } from ".prisma/client"

// Test accounts for development
const TEST_ACCOUNTS: Partial<User>[] = [
  {
    id: "free-test-account",
    name: "Free User",
    email: "free@test.com",
    password: "test123",
    role: "user",
    premium: false,
    bio: "I'm a free user testing out the karaoke features!",
    location: "Test City",
    website: "https://example.com",
    emailNotifications: true,
    pushNotifications: true,
    theme: "system",
    language: "en",
    createdAt: new Date("2024-01-01"),
    isPremium: false,
    premiumUntil: null
  },
  {
    id: "premium-test-account",
    name: "Premium User",
    email: "premium@test.com",
    password: "test123",
    role: "user",
    premium: true,
    bio: "I'm a premium user enjoying all the features!",
    location: "Premium City",
    website: "https://premium-example.com",
    emailNotifications: true,
    pushNotifications: true,
    theme: "system",
    language: "en",
    createdAt: new Date("2024-01-01"),
    isPremium: true,
    premiumUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  }
]

// Function to validate test credentials
const validateTestCredentials = (email: string, password: string): Partial<User> | null => {
  const testAccount = TEST_ACCOUNTS.find(account => account.email === email && account.password === password)
  return testAccount || null
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/error"
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Use the test accounts defined above
        const testAccount = validateTestCredentials(credentials.email, credentials.password);
        if (testAccount) {
          return testAccount as User;
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.user) {
        return {
          ...token,
          ...session.user
        };
      }
      
      if (user) {
        return {
          ...token,
          ...user
        };
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user = {
          ...session.user,
          id: token.id,
          premium: token.premium,
          role: token.role,
          emailNotifications: token.emailNotifications,
          pushNotifications: token.pushNotifications,
          createdAt: token.createdAt,
          isPremium: token.isPremium,
          premiumUntil: token.premiumUntil,
          premiumPlan: token.premiumPlan,
          premiumExpiresAt: token.premiumExpiresAt
        };
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
} 