import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const authUrl = process.env.BETTER_AUTH_URL;
const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db();
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
      // Local email/password accounts have emailVerified: false (no email
      // verification flow is configured). Without this, signing in with Google
      // using the same email fails with "account_not_linked".
      requireLocalEmailVerified: false,
    },
  },
  plugins: [
    jwt({
      jwt: {
        issuer: authUrl,
        audience: authUrl,
      },
    }),
  ],
  ...(googleClientId && googleClientSecret
    ? {
        socialProviders: {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        },
      }
    : {}),
});