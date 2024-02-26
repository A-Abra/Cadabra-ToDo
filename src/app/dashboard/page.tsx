import CreateNoteDialog from '@/components/CreateNoteDialog';
import { ModeToggle } from '@/components/DarkMode';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/db';
import { $notes } from '@/lib/db/schema';
import { UserButton, auth } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { ArrowBigLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

type Props = {};

const DashboardPage = async (props: Props) => {

    const { userId } = auth()
    const notes = await db.select().from($notes).where(
        // ! to userId to always ensure user will always exist
        eq($notes.userId, userId!)
    )

    return (
        <>
            <div className='grainy min-h-screen'>
                <div className='max-w-7xl mx-auto p-10'>
                    <div className='h-14'></div>
                    <div className='flex justify-between items-center md:flex-row flex-col'>
                        <div className='flex items-center'>
                            <Link href='/'>
                                <Button className='bg-indigo-700' size='sm'>
                                    <ArrowBigLeft className='mr-1 w-4 h-4' />
                                    Back
                                </Button>
                            </Link>
                            <div className='w-4'></div>
                            <h1 className='text-3xl font-bold text-gray-900'>My Notes</h1>
                            <div className='w-4'></div>
                            <UserButton />
                        </div>
                        {/* <ModeToggle /> ModeToggle component here */}
                        <ModeToggle />
                    </div>

                    <div className='h-8'></div>
                    <Separator />
                    <div className='h-8'></div>
                    {/* LIST ALL NOTES */}

                    {notes.length === 0 && (
                        <div className='text-center'>
                            <h2 className='text-xl text-gray-500'>You have no notes yet.</h2>
                        </div>
                    )}


                    {/* display all notes */}
                    <div className='grid sm:grid-cols-3 md:grid-cols-5 grid-cols-1 gap-3'>
                        <CreateNoteDialog />
                        {notes.map(note => {
                            return (
                                <a href={`/notebook/${note.id}`} key={note.id}>
                                    <div className='overflow-hidden rounded-lg border border-stone-200 flex flex-col hover:shadow-xl transition hover:-translate-y-1'>
                                        <Image width={400} height={200} alt={note.name} src={note.imageUrl || ''}/>
                                        <div className='p-4'>
                                            <h3 className='text-xl font-semibold text-gray-900'>
                                                {note.name}
                                            </h3>
                                            <div className='h-1'></div>
                                            <p className='text-sm text-gray-500'>
                                                {new Date(note.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </a>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardPage;