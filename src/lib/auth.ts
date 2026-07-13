import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

const authSecret =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  process.env.JWT_SECRET ||
  "dev-secret-change-me";

const providers = [
  ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
    ? [
        Google({
          clientId: process.env.AUTH_GOOGLE_ID,
          clientSecret: process.env.AUTH_GOOGLE_SECRET,
          authorization: {
            params: {
              prompt: "consent",
              access_type: "offline",
              response_type: "code",
            },
          },
        }),
      ]
    : []),
  Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const result = await query(
            "SELECT * FROM users WHERE email = $1",
            [credentials.email]
          );

          if (result.rows.length === 0) {
            return null;
          }

          const user = result.rows[0];
          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password_hash
          );

          if (!isValid) {
            return null;
          }

          return {
            id: user.user_id.toString(),
            email: user.email,
            name: user.username,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    }),
  ];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Check if user exists by Google ID
          let result = await query(
            "SELECT * FROM users WHERE google_id = $1",
            [account.providerAccountId]
          );

          if (result.rows.length === 0) {
            // Check if email already exists
            result = await query(
              "SELECT * FROM users WHERE email = $1",
              [user.email]
            );

            if (result.rows.length > 0) {
              // Email exists, link Google account
              await query(
                `UPDATE users 
                 SET google_id = $1, 
                     avatar = $2, 
                     email_verified = TRUE,
                     username = COALESCE(NULLIF(username, ''), $3)
                 WHERE email = $4`,
                [account.providerAccountId, user.image, user.name, user.email]
              );
            } else {
              // Create new user
              await query(
                `INSERT INTO users (email, username, google_id, avatar, email_verified, password_hash, role)
                 VALUES ($1, $2, $3, $4, TRUE, '', 'USER')`,
                [user.email, user.name, account.providerAccountId, user.image]
              );
            }
          } else {
            // Update existing user's info
            await query(
              `UPDATE users 
               SET avatar = $1, 
                   username = $2,
                   email_verified = TRUE
               WHERE google_id = $3`,
              [user.image, user.name, account.providerAccountId]
            );
          }

          return true;
        } catch (error) {
          console.error("Error during Google sign-in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        // Get user data from database
        try {
          let dbUser;
          if (account?.provider === "google") {
            const result = await query(
              "SELECT * FROM users WHERE google_id = $1 OR email = $2",
              [account.providerAccountId, user.email]
            );
            dbUser = result.rows[0];
          } else {
            const result = await query(
              "SELECT * FROM users WHERE user_id = $1",
              [user.id]
            );
            dbUser = result.rows[0];
          }

          if (dbUser) {
            token.id = dbUser.user_id;
            token.role = dbUser.role;
            token.avatar = dbUser.avatar;
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = String(token.id);
        session.user.role = token.role as string;
        session.user.avatar = token.avatar as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: authSecret,
  trustHost: true,
});