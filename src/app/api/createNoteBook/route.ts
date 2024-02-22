// map to /api/createNoteBook

import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { generateImage, generateImagePrompt } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// exporting this runtime variable is auto detected by vercel, deploying it on
// h-runtime instead of the standard runtime initially
// https://vercel.com/docs/functions/runtimes
export const runtime = "edge";


export async function POST(req: Request) {
    const { userId } = auth();
    if (!userId) {
        return new NextResponse('unauthorized', { status: 401 });
    }
    const body = await req.json();
    const { name } = body;
    const image_description = await generateImagePrompt(name);
    if (!image_description) {
        return new NextResponse('failed to generate image description', {
            status: 500,
        });
    }
    const image_url = await generateImage(image_description);
    if (!image_url) {
        return new NextResponse('failed to generate image', {
            status: 500,
        });
    }

    const note_ids = await db.insert($notes).values({
        name: name,
        userId: userId,
        imageUrl: image_url,
    }).returning({
        insertedId: $notes.id
    })

    return NextResponse.json({
        note_id: note_ids[0].insertedId,
    });
}
