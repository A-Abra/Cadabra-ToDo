import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { uploadFileToFirebase } from "@/lib/firebase";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { noteId } = await req.json();
        // extract dalle imageUrl
        const notes = await db.select().from($notes).where(
            eq($notes.id, parseInt(noteId))
        )
        if (!notes[0].imageUrl)
            return new NextResponse('no url for image', {status: 400});

        // save it to firebase for permanent reuse
        // Dalle image url and image name put into firebase storage spitting back out firebase url
        const firebaseUrl = await uploadFileToFirebase(notes[0].imageUrl, notes[0].name)
        await db.update($notes).set({
            imageUrl: firebaseUrl,
        }).where(eq($notes.id, parseInt(noteId)));
        return new NextResponse("Url converted into firebase", {status: 200});
    } catch (error) {
        console.error(error);
        return new NextResponse("Firebase URL Error", { status: 500});
    }
}