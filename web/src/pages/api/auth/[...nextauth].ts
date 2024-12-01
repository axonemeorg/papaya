import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";

const clientId = process.env.AUTH_GOOGLE_ID ?? '';
const clientSecret = process.env.AUTH_GOOGLE_SECRET ?? '';

export const authOptions: AuthOptions = {
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
    callbacks: {
        // async jwt({ token, account }) {
        //     if (account) {
        //         token = Object.assign({}, token, { access_token: account.access_token });
        //     }
        //     return {
        //         ...token,
                
        //     }
        // },
        // async session({ session, token }) {
        //     if (session) {
        //         session = Object.assign({}, session, { access_token: token.access_token })
        //         // console.log(session);
        //     }
        //     return {
        //         ...session,
        //         test: 'Hello world',
        //         the_token: token,
        //     }
        // }
    }
}

export default NextAuth(authOptions)
