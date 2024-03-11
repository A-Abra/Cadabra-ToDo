'use client'
import Image from 'next/image'
import { Button } from '@/components/ui/button';
import '@/components/ui/glitch.css';
import Link from 'next/link';
import { ArrowBigRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function Home() {
  const allChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  const originalTextRef1 = useRef<string>('Cadabra ToDo. An');
  const originalTextRef2 = useRef<string>('Note Assistant.');

  const hackedText = (textRef: React.MutableRefObject<string>, className: string, delay: number) => {
    const element: HTMLElement | null = document.querySelector(className);

    if (element) {
      let iteration: number = 0;
      const interval = setInterval(() => {
        if (!element) return;

        element.textContent = element.textContent!
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return textRef.current[index] || ''; // Revert back to original text
            }
            return allChars[Math.floor(Math.random() * allChars.length)];
          })
          .join("");

        if (iteration >= textRef.current.length) {
          clearInterval(interval);
          if (textRef.current === originalTextRef1.current) {
            // Start the animation for the next text after a delay
            setTimeout(() => {
              hackedText(originalTextRef2, '.hacked-text2', 0);
            }, delay);
          }
        }
        iteration += 1 / 3;
      }, 30);
    } else {
      console.log(`Element with class name ${className} doesn't exist`);
    }
  };

  useEffect(() => {
    hackedText(originalTextRef1, '.hacked-text1', (originalTextRef1.current.length * 30) + 500);
  }, []);

  return (
    <div className='bg-gradient-to-r min-h-screen grainy from-blue-700 to-red-800'>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <h1 className='font-semibold text-7xl text-center'>
          {/* glitch class plays the glitchy animation only on the AI segment of the string */}
          <span className='hacked-text1'>                </span> <span className='glitch fade'><span className='glitch-text' aria-hidden="true">AI</span>
            AI
            <span className='glitch-text' aria-hidden="true">AI</span>
          </span> <span className='hacked-text2'>               </span>
        </h1>
        <div className='mt-4'></div>
        <h2 className='to-dashboard font-semibold text-3xl text-center text-slate-700'>
          Powered with OpenAI
        </h2>
        <div className='mt-8'></div>

        <div className='flex justify-center'>
          <Link href='/dashboard'>
            <Button className='to-dashboard bg-indigo-700'>Get Started
              <ArrowBigRight className='ml-2 w-5 h-5' strokeWidth={3} />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  )
}
