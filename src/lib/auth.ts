import { NextAuthOptions } from "next-auth"
import GoogleProvider from 'next-auth/providers/google'

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
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube-music.readonly',
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET
} 