"use client"
import React, { useContext, useEffect, useRef, useState } from 'react'
import EmptyChatState from './EmptyChatState'
import { AssistantContext } from '@/context/AssistantContext';
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

// Enhanced formatter component to handle bold text and code blocks
function FormattedMessage({ content }: any) {
  // Process the content into formatted chunks
  const processContent = () => {
    if (!content) return null;
    
    // First split by code blocks (```code```)
    const codeBlockRegex = /(```[\s\S]*?```)/g;
    const splitByCodeBlocks = content.split(codeBlockRegex);
    
    return splitByCodeBlocks.map((chunk:any, index:any) => {
      // If this is a code block
      if (chunk.startsWith('```') && chunk.endsWith('```')) {
        // Extract language and code
        const codeContent = chunk.slice(3, -3);
        let language = '';
        let code = codeContent;
        
        // Check if there's a language specifier
        const firstLineBreak = codeContent.indexOf('\n');
        if (firstLineBreak > 0) {
          language = codeContent.slice(0, firstLineBreak).trim();
          code = codeContent.slice(firstLineBreak + 1);
        }
        
        return (
          <pre key={index} className="bg-gray-100 dark:bg-gray-800 p-3 rounded my-2 overflow-x-auto w-full">
            {language && (
              <div className="text-xs text-gray-500 mb-1">{language}</div>
            )}
            <code>{code}</code>
          </pre>
        );
      } 
      // Regular text - process line by line for bold formatting
      else {
        return chunk.split('\n').map((line:any, lineIndex:any) => {
          // Process bold text (**text**)
          const boldRegex = /\*\*(.*?)\*\*/g;
          const parts = [];
          let lastIndex = 0;
          let match;
          
          // Find all bold patterns
          while ((match = boldRegex.exec(line)) !== null) {
            if (match.index > lastIndex) {
              parts.push(line.substring(lastIndex, match.index));
            }
            parts.push(<strong key={`bold-${lineIndex}-${match.index}`}>{match[1]}</strong>);
            lastIndex = match.index + match[0].length;
          }
          
          // Add the remaining text
          if (lastIndex < line.length) {
            parts.push(line.substring(lastIndex));
          }
          
          return (
            <React.Fragment key={`line-${lineIndex}`}>
              {parts.length > 0 ? parts : line}
              {lineIndex < chunk.split('\n').length - 1 && <br />}
            </React.Fragment>
          );
        });
      }
    });
  };
  
  return (
    <div className="whitespace-pre-wrap break-words">
      {processContent()}
    </div>
  );
}

function ChatUi() {
  const { assistant, setAssistant } = useContext(AssistantContext);
  const [input, setInput] = useState<string>("")
  const [messages, setMessages] = useState<MESSAGE[]>([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const {user, setUser} = useContext(AuthContext);
  const UpdateTokens = useMutation(api.users.UpdateTokens);

  const onSendMessage = async (messageText = input) => {
    setLoading(true)
    setMessages(prev => [...prev, 
      { role: 'user', content: messageText },
      { role: 'assistant', content: 'Loading...' }
    ])
    const userInput = messageText;
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

  const handleSuggestionClick = (suggestion : any) => {
    onSendMessage(suggestion);
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
      {messages?.length == 0 && <EmptyChatState onSuggestionClick={handleSuggestionClick} />}

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
                
                {/* Enhanced message formatting */}
                {msg.content === 'Loading...' ? (
                  <h2>{msg.content}</h2>
                ) : (
                  <FormattedMessage content={msg.content} />
                )}
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

export default ChatUi