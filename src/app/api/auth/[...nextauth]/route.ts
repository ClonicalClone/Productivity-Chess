import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"

export const { handlers: { GET, POST }, auth } = NextAuth({
    providers: [GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
        clientId: process.env.GITHUB_CLIENT,
        clientSecret: process.env.GITHUB_SECRET,
    })
    ],
})
