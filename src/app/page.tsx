import Image from 'next/image'
import { Button } from '@/components/ui/button';
import '@/components/ui/glitch.css';
import Link from 'next/link';
import { ArrowBigRight } from 'lucide-react'


export default function Home() {
  return (
    <div className='bg-gradient-to-r min-h-screen grainy from-blue-700 to-red-800'>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <h1 className='font-semibold text-7xl text-center'>
          {/* glitch class plays the glitchy animation only on the AI segment of the string */}
          Cadabra ToDo. An <span className='glitch'>
            AI</span> Note Assistant.
        </h1>
        <div className='mt-4'></div>
        <h2 className='font-semibold text-3xl text-center text-slate-700'>
          Powered with OpenAI
        </h2>
        <div className='mt-8'></div>

        <div className='flex justify-center'>
          <Link href='/dashboard'>
            <Button className='bg-indigo-700'>Get Started
              <ArrowBigRight className='ml-2 w-5 h-5' strokeWidth={3} />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  )
}

{/* <span className='glitch-text' aria-hidden="true">AI</span>
            AI
            <span className='glitch-text' aria-hidden="true">AI</span> */}

// <p className='glitch'>
//             <span aria-hidden="true">Glitch text</span>Glitch text<span aria-hidden="true">Glitch text</span>
//           </p>