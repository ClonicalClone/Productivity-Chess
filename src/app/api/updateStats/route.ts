import { NextResponse } from "next/server";
import { auth } from "../auth/[...nextauth]/route";
import { cookies } from "next/headers";
import { createClient } from "../../utils/server";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { elo, delta_value, puzzles_solved } = body;

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
        .from("users")
        .update({
            elo,
            delta_value,
            puzzles_solved,
        })
        .eq("email", session.user.email);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
}
