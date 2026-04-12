// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SERVICE_ROLE_KEY!; // service role for server-side
const supabase = createClient(supabaseUrl, supabaseKey); // initialize once

export const { handlers: { GET, POST }, auth } = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            if (!user.email) return false;

            const { data: existing, error: fetchError } = await supabase
                .from("users")
                .select("*")
                .eq("email", user.email)
                .maybeSingle();

            if (fetchError) {
                console.error("Supabase fetch error in signIn:", fetchError);
            }

            if (!existing) {
                const { error: insertError } = await supabase.from("users").insert({
                    email: user.email,
                    elo: 1200,
                    puzzles_solved: 0,
                    delta_value: 200,
                    course: 1,
                });

                if (insertError) {
                    console.error("CRITICAL: Failed to insert user into DB (Possible RLS issue?):", insertError);
                } else {
                    console.log("Successfully inserted new user into database:", user.email);
                }
            }
            return true;
        },
        async session({ session }: any) {
            if (!session.user.email) return session;

            const { data: profile } = await supabase
                .from("users")
                .select("id, elo, puzzles_solved, delta_value, course")
                .eq("email", session.user.email)
                .maybeSingle();

            if (profile) {
                session.user.id = profile.id;
                session.user.elo = profile.elo;
                session.user.puzzles_solved = profile.puzzles_solved;
                session.user.delta_value = profile.delta_value;
                session.user.course = profile.course;
            }
            return session;
        },
    },
});
