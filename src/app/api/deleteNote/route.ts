import { db } from "@/lib/db"
import { $notes } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

// database call to delete note when user confirms deletion
// from delete button
export async function POST(req:Request) {
    const {noteId} = await req.json()
    await db.delete($notes).where(
        eq($notes.id, parseInt(noteId))
    )
    return new NextResponse('ok', {status:200})
}