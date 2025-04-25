"use client"
import React, { useContext, useEffect, useRef, useState } from 'react'
import EmptyChatState from './EmptyChatState'
import { AssistantContext } from '@/context/AssistantContext';
import { div } from 'motion/react-client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2Icon, Send } from 'lucide-react';
import AiModelOptions from '@/services/AiModelOptions';
import axios from 'axios';
import Image from 'next/image';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { AuthContext } from '@/context/AuthContext';
import { ASSISTANT } from '../../ai-assistants/page';

type MESSAGE = {
  role: string,
  content: string
}

function CharUi() {
  const { assistant, setAssistant } = useContext(AssistantContext);
  const [input, setInput] = useState<string>("")
  const [messages, setMessages] = useState<MESSAGE[]>([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const {user, setUser} = useContext(AuthContext);
  const UpdateTokens = useMutation(api.users.UpdateTokens);

  const onSendMessage = async () => {
    setLoading(true)
    setMessages(prev => [...prev, 
      { role: 'user', content: input },
      { role: 'assistant', content: 'Loading...' }
    ])
    const userInput = input;
    setInput('');
    const aiModel = AiModelOptions.find(item => item.name == assistant.aiModelId);

    const result = await axios.post('api/eden-ai-model', {
      provider: aiModel?.edenAi,
      userInput: userInput,
      aiResp : messages[messages?.length - 1]?.content
    })

    setMessages(prev => prev.slice(0, -1))
    setMessages(prev => [...prev, result.data])
    setLoading(false)
    updateUserToken(result.data?.content)
  }

  useEffect(() => {
    if(chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages])

  useEffect(() => {
    setMessages([])
  }, [assistant?.id])

  const updateUserToken = async (resp:string) => {
    const tokenCount = resp.trim()?resp.trim().split(/\s+/).length:0
    console.log(tokenCount)
    const result = await UpdateTokens({
      credits: user?.credits - tokenCount,
      uid: user?._id
    })

    setUser((prev:ASSISTANT) => {
      return {
        ...prev,
        credits: user?.credits - tokenCount
      }
    })

    console.log(result)
  }

  return (
    <div className='mt-20 p-6 relative h-[88vh]'>
      {messages?.length == 0 && <EmptyChatState />}

      <div ref={chatRef} className='h-[74vh] overflow-scroll'>
        {messages.map((msg, index) => (
          <div key={index}
            className={`flex mb-2 ${msg.role == 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className='flex gap-3'>
              {msg.role == 'assistant' && <Image src = {assistant?.image} alt = 'Assistant' 
              width={100}
              height={100}
              className='w-[30px] h-[30px] rounded-full'
              />}
              <div
                className={`p-3 rounded-lg flex gap-2 ${msg.role == 'user' ? 'bg-gray-200 text-black rounded-lg' : 'bg-gray-50 text-black'}`}
              >
                {loading && messages?.length -1 == index && <Loader2Icon className='animate-spin'/>}
                <h2>{msg.content}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='flex justify-between bottom-5 absolute w-[92%] p-5 gap-5'>
        <Input placeholder='Ask...'
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key == 'Enter' && onSendMessage()}
          value={input}
          disabled={loading}
        />
        <Button disabled={loading} onClick={() => onSendMessage()}><Send /></Button>
      </div>

    </div>
  )
}

export default CharUi
