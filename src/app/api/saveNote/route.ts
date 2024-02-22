import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        /* EditorState is the debounced console.log
        noteId to see which note we need to update correctly*/
        let { noteId, editorState } = body;
        if (!editorState || !noteId)
            return new NextResponse('Missing editorState or noteId', { status: 400 });

        noteId = parseInt(noteId);
        const notes = await db.select().from($notes).where(
            eq($notes.id, noteId)
        )

        if (notes.length != 1)
            return new NextResponse('failed to update note', { status: 500 });

        const note = notes[0];
        // old state in db vs new state if different to update
        if (note.editorState !== editorState){
            await db.update($notes).set({
                editorState,
            }).where(eq($notes.id, noteId));
            // note id = note id passed in from the body
            // update editorState based on noteId 
        }
        return NextResponse.json({
            success: true
        }, {status: 200})
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            success: false
        }, {status: 500})
    }
}