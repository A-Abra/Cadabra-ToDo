import DeleteButton from '@/components/DeleteButton'
import TipTapEditor from '@/components/TipTapEditor'
import { Button } from '@/components/ui/button'
import { clerk } from '@/lib/clerk-server'
import { db } from '@/lib/db'
import { $notes } from '@/lib/db/schema'
import { auth } from '@clerk/nextjs'
import { and, eq } from 'drizzle-orm'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'


type Props = {
    params: {
        noteId: string
    }
}

const NotebookPage = async ({ params: { noteId } }: Props) => {
    const { userId } = await auth();
    // if unauthenticated redirect to dashboard
    if (!userId)
        return redirect('/dashboard');

    const user = await clerk.users.getUser(userId);
    // if authenticated database call to try to get all the notes
    const notes = await db.select().from($notes).where(
        and(
            // $notes.id == params noteId
            eq($notes.id, parseInt(noteId)),
            // userId of note should equal userId logged in
            eq($notes.userId, userId)
        )
    )
    // if there is not even one note then we redirect to dashboard
    if (notes.length != 1)
        return redirect('/dashboard');
    // if there is a note it has to be in notes index 0
    const note = notes[0];
    
    // json string to debug
    // return <pre>{JSON.stringify(note, null, 2)}</pre>;
    return (
        <div className='min-h-screen grainy p-8'>
            <div className='max-w-4xl mx-auto'>
                <div className='boarder shadow-xl border-stone-200 ronded-lg p-4 flex items-center'>
                    <Link href='/dashboard'>
                        <Button className='bg-indigo-700' size='sm'>
                            Back
                        </Button>
                    </Link>
                    <div className="w-3"></div>
                    <span className='font-semibold'>
                        {user.firstName} {user.lastName}
                    </span>
                    <span className='inline-block mx-1'>/</span>
                    <span className='text-stone-500 font-semibold'>{note.name}</span>
                    <div className="ml-auto">
                        <DeleteButton noteId={note.id} />
                    </div>
                </div>

                <div className='h-4'></div>
                <div className='border-stone-200 shadow-xl border rounded-lg px-16 py-8 w-full'>
                    {/* pass in note object from database */}
                    <TipTapEditor note={note}/>
                </div>
            </div>
        </div>
    );
};

export default NotebookPage;