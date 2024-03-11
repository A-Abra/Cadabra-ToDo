'use client'
import React, { useRef } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import TipTapMenuBar from './TipTapMenuBar'
import { Button } from './ui/button'
import { useDebounce } from '@/lib/useDebounce'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { NoteType } from '@/lib/db/schema'
import Text from '@tiptap/extension-text'
import { useCompletion } from 'ai/react'

// NoteType from schema.ts
type Props = { note: NoteType };

const TipTapEditor = ({ note }: Props) => {
    // if there is no editorState then set to empty string && '<h1>${note.name}<h1>' is for the note name just for U.E.
    const [editorState, setEditorState] = React.useState(note.editorState || `<h1>${note.name}</h1>`);
    const { complete, completion } = useCompletion({
        api: '/api/completion'
    });
    // button reference attached in html to access button element in order to click
    const buttonRef = useRef(null);

    const saveNote = useMutation({
        mutationFn: async () => {
            const response = await axios.post('/api/saveNote', {
                noteId: note.id,
                editorState: editorState,
            });
            return response.data;
        },
    });

    // Keybind to shift+a for AI assisted writing
    const customText = Text.extend({
        addKeyboardShortcuts() {
            return {
                "Shift-a": () => {
                    const prompt = this.editor.getText().split(' ').slice(-30).join(' ');
                    console.log(prompt);
                    complete(prompt);
                    return true;
                },
            };
        },
    });

    const editor = useEditor({
        autofocus: true,
        extensions: [StarterKit, customText],
        content: editorState,
        // editor allows to use this method to get back HTML 
        // which will then bind it to the internal local state
        onUpdate: ({ editor }) => {
            setEditorState(editor.getHTML());
        },
    });

    /* When the completion comes back we keep track of a lastCompletion 
    reference which will not change or rerender the whole component 
    whenever there is a change. */
    const lastCompletion = React.useRef('')
    React.useEffect(() => {
        if (!completion || !editor) return;
        // diff represents individual tokens
        // after taking difference set last completion to finish the loop and get the latest token
        const diff = completion.slice(lastCompletion.current.length);
        lastCompletion.current = completion;
        editor.commands.insertContent(diff);
    }, [completion, editor]);

    // React.useEffect(() => {
    //     if (!editor || !token) return
    //     // getting individual words to insert into editor
    //     console.log(token);
    //     editor.commands.insertContent(token);
    // }, [token, editor]);

    // React.useEffect(() => {
    //     if (!editor) return
    //     // getting individual words to insert into editor
    //     editor?.commands.insertContent(completion);
    //     console.log(completion);
    // }, [completion, editor]);


    /* Allows data to be sent to the db and is printed in console.
    Use dbounce for perfomance optimization rather than 
    continuously feeding in data by keystroke */
    const debouncedEditorState = useDebounce(editorState, 500); //delay by 500ms
    React.useEffect(() => {
        // once debounce is triggered then hit endpoint to save
        // editorState within db
        if (debouncedEditorState === '') return;
        saveNote.mutate(undefined, {
            onSuccess: data => {
                console.log('Updated successfully', data);
            },
            onError: error => {
                console.error(error);
            },
        });
        // console.log(debouncedEditorState);
    }, [debouncedEditorState]);
    // updating debouncedEditorState dependencies gives weird bug where Saving button stuck in isPending loop

    // React.useEffect(()=>{
    //     console.log(editorState);
    // }, [editorState]);

    // User can click Shift+a button as well to allow for more accessibility
    const handleButtonClick = () => {
        // editor?.getText() checks if editor exists before accessing method so if editor null, evals to undef
        // || used for empty string as a fallback value to prevent errors
        if (buttonRef.current) {
            complete(editor?.getText().split(' ').slice(-30).join(' ') || ''); // Use empty string as fallback
        }
    };

    return (
        <>
            <div className='flex'>
                {editor && <TipTapMenuBar editor={editor} />}
                <Button disabled variant={"outline"}>
                    {saveNote.isPending ? "Saving..." : "Saved"}
                </Button>
            </div>

            {/* prose allows heading 1-6 buttons to work */}
            <div className='prose prose-sm w-full mt-4'>
                <EditorContent editor={editor} />
            </div>
            <div className='h-4'></div>
            <span className='text-sm'>
                Tip: Press{' '}
                <button className='px-2 py1.5 text-xs font-semibold text-gray-800 bg-gray-200 border-gray-200 rounded-lg'
                    ref={buttonRef}
                    onClick={handleButtonClick}>
                    Shift + A
                </button> {' '}
                for AI autocomplete
            </span>
        </>
    );
};

export default TipTapEditor;