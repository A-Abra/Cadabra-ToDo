'use client'
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Loader2, Plus } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

type Props = {};

const CreateNoteDialog = (props: Props) => {
    const router = useRouter();
    const [input, setInput] = React.useState('')
    const uploadToFirebase = useMutation({
        mutationFn: async (noteId: string) => {
            const response = await axios.post('/api/firebaseUpload', {
                noteId
            })
            return response.data;
        }
    })
    const createNotebook = useMutation({
        mutationFn: async () => {
            // Perform asynchronous operation, e.g. an API call
            const response = await axios.post('/api/createNoteBook', {
                name: input,
            });
            return response.data; // Return data after operation completes
        },
    });

    console.log('CREATENOTEBOOK:', createNotebook)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (input === '') {
            window.alert('Please enter a name for your notebook');
            return;
        }
        createNotebook.mutate(undefined, {
            onSuccess: ({note_id}) => {
                console.log('Notebook created with id: ', {note_id});
                // hit another endpoint to upload the temp dalle url to
                // call firebase function passing in note ID going to mutation function
                // then hits uploadfirebase api with the noteId which then takes the
                // temporary dalle api image url to convert to firebase url, ret res_data
                uploadToFirebase.mutate(note_id);
                // permanent firebase url address since dalle images expire 1hr
                router.push(`/notebook/${note_id}`);
            },
            onError: error => {
                console.error(error);
                window.alert('Failed creating notebook');
            },
        });
    };

    return (
        <Dialog>
            <DialogTrigger>
                <div className='border-dashed border-2 flex border-indigo-700 h-full rounded-lg items-center justify-center sm:flex-col hover:shadow-xl transition hover:-translate-y-1 flex-row p-4'>
                    <Plus className='w-6 h-6 text-indigo-700' strokeWidth={3} />
                    <h2 className='font-semibold text-indigo-700 sm:mt-2'>
                        New Note Book
                    </h2>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        New Notebook
                    </DialogTitle>
                    <DialogDescription>
                        You can create a new note by clicking the button below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <Input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder='Notebook Name'
                    />
                    <div className="h-4"></div>
                    <div className="flex items-center gap-2">
                        <Button type='reset' variant={'secondary'}>
                            Cancel
                        </Button>
                        <Button type='submit' className='bg-indigo-700' disabled={createNotebook.isPending}>
                            {createNotebook.isPending && (
                                <Loader2 className='w-4 h-4 mr-2 animate-spin'/>
                            )}
                            Create
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
};

export default CreateNoteDialog;