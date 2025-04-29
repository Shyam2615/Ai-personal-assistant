import { BlurFade } from '@/components/magicui/blur-fade';
import { SparklesText } from '@/components/magicui/sparkles-text'
import { AssistantContext } from '@/context/AssistantContext';
import { ChevronRight } from 'lucide-react';
import React, { useContext } from 'react'

function EmptyChatState({ onSuggestionClick } : any) {  // Add this prop
    const { assistant, setAssistant } = useContext(AssistantContext);
    return (
        <div className='flex flex-col items-center'>
            <SparklesText className='text-4xl text-center'>How Can I Assist You?</SparklesText>

            <div className='mt-7'>
                {assistant?.sampleQuestions.map((suggestion: string, index: number) => (
                    <BlurFade key={suggestion} delay={0.25 * index}>
                        <div key={index} onClick={() => onSuggestionClick(suggestion)}>  {/* Add onClick handler */}
                            <h2 className='p-4 text-lg border rounded-xl mt-1 hover:bg-gray-100 cursor-pointer flex items-center justify-between gap-10'>
                                {suggestion} <ChevronRight />
                            </h2>
                        </div>
                    </BlurFade>
                ))}
            </div>
        </div>
    )
}

export default EmptyChatState