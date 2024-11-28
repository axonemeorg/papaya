import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";

const clientId = process.env.AUTH_GOOGLE_ID ?? '';
const clientSecret = process.env.AUTH_GOOGLE_SECRET ?? '';

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId,
            clientSecret,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        })
    ],
}

export default NextAuth(authOptions)
