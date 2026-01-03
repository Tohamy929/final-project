import NextAuth, { DefaultSession } from "next-auth";

// Extend the built-in types
declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    token?: string;         // API access token
    refreshToken?: string;  // optional refresh token
    expiresIn?: number;     // optional expiry in seconds
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      token?: string;       // expose API token on session.user
    };
    error?: string;         // allow session.error for refresh failures
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string;
    name?: string;
    apiToken?: string;       // stored API token
    refreshToken?: string;   // stored refresh token
    accessTokenExpires?: number; // expiry timestamp (ms)
    error?: string;          // track refresh errors
  }
}