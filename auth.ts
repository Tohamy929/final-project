
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

async function refreshAccessToken(token: any) {
  try {
    const res = await fetch("https://ecommerce.routemisr.com/api/v1/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    const refreshed = await res.json();

    if (!res.ok) throw refreshed;

    return {
      ...token,
      apiToken: refreshed.token,
      refreshToken: refreshed.refreshToken ?? token.refreshToken,
      accessTokenExpires: Date.now() + refreshed.expiresIn * 1000,
    };
  } catch (error) {
    console.error("Refresh token failed", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      authorize: async (credentials) => {
        const res = await fetch("https://ecommerce.routemisr.com/api/v1/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        return {
          id: data.user?._id,
          email: data.user?.email,
          name: data.user?.name,
          token: data.token,
          refreshToken: data.refreshToken, // if backend provides it
          expiresIn: data.expiresIn,       // seconds until expiry
        };
      },
    }),
  ],
 callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.email = user.email;
      token.name = user.name;
      token.apiToken = user.token;
      token.refreshToken = user.refreshToken;
      token.accessTokenExpires = Date.now() + (user.expiresIn ?? 3600) * 1000;
    }
    // refresh logic here…
    return token;
  },
  async session({ session, token }) {
    session.user.id = token.id!;
    session.user.email = token.email!;
    session.user.name = token.name!;
    session.user.token = (token.apiToken as string | undefined);
    session.error = token.error;
    return session;
  },
},
  secret: process.env.NEXTAUTH_SECRET,
};