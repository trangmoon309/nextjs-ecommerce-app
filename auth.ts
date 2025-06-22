import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/db/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compareSync } from 'bcrypt-ts-edge';
import type { NextAuthConfig } from 'next-auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const config = {
  pages: {
    signIn: '/sign-in',
    signOut: '/sign-out',
    error: '/sign-in',
    verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: '/auth/new-user', // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        // Find user in the database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        // Check if user exists and if the password matches
        if (user && user.password) {
          const isMatch = compareSync(credentials.password as string, user.password);

          // If password is correct, return user
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }

        // If user does not exist or password does not match
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      // Set the userID from the token
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      // If there is an update, set the user name
      if (trigger === 'update') {
        session.user.name = user.name;
      }

      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'development',
      },
    },
  },
  async jwt({ token, user, trigger, session }: any) {
    // Assign user fields to token
    if (user) {
      token.role = user.role;

      if (user.name === 'NO_NAME') {
        token.name = user.email!.split('@')[0];
      }

      // Update the database to reflect the token name
      await prisma.user.update({
        where: { id: user.id },
        data: { name: token.name },
      });

      return token;
    }

    return token;
  },
  authorized({ request, auth }: any) {
    // Check for session cart cookie
    if (!request.cookie.get('sessionCartId')) {
      // generate new session cart id cookie
      const sessionCartId = crypto.randomUUID();

      // clone the request headers
      const newRequestHeaders = new Headers(request.headers);

      // create new response and add the new headers
      // and then let the request continue.
      const response = NextResponse.next({
        request: {
          headers: newRequestHeaders,
        },
      });

      // set newly generated sessionCartId in the response cookies
      response.cookies.set('sessionCartId', sessionCartId);

      return response;
    } else {
      return true;
    }
  },
} satisfies NextAuthConfig; // ensure the configuration object compatible with NextAuthConfig

// When the user clicks the "Sign In" button
// The signIn() function from next-auth is called
// This triggers a request to NextAuth's built-in route, like: /api/auth/callback/credentials (for credentials) or /api/auth/signin (for OAuth)
// These routes are handled internally by the exported handlers (GET, POST)
// Which come from below code.
export const { handlers, auth, signIn, signOut } = NextAuth(config);
