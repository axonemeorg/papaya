import NextAuth, { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const clientId = process.env.AUTH_GOOGLE_ID ?? ''
const clientSecret = process.env.AUTH_GOOGLE_SECRET ?? ''

export const authOptions: AuthOptions = {
	// Configure one or more authentication providers
	providers: [
		GoogleProvider({
			clientId,
			clientSecret,
			authorization: {
				params: {
					prompt: 'consent',
					access_type: 'offline',
					response_type: 'code',
				},
			},
		}),
	],
	session: {
		strategy: 'jwt',
	},
}

export default NextAuth(authOptions)
