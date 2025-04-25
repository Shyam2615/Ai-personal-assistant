"use client"
import { AssistantContext } from '@/context/AssistantContext'
import Image from 'next/image';
import React, { useContext, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import AiModelOptions from '@/services/AiModelOptions';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2Icon, Save, Trash } from 'lucide-react';
import { ASSISTANT } from '../../ai-assistants/page';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import ConfirmationAlert from '../ConfirmationAlert';
import { BlurFade } from '@/components/magicui/blur-fade';


function AssistantSettings() {

  const { assistant, setAssistant } = useContext(AssistantContext);
  const UpdateAssistant = useMutation(api.userAiAssistants.UpdateUserAiAssistant);
  const DeleteAssistant = useMutation(api.userAiAssistants.DeleteAssistant);
  const [loading, setLoading] = useState(false);

  const onHandleInputChange = (field: string, value: string) => {
    setAssistant((prev: any) => ({
      ...prev,
      [field]: value
    }))
  }

  const onSave = async () => {
    setLoading(true);

    const result = await UpdateAssistant({
      id: assistant?._id,
      aiModelId: assistant?.aiModelId,
      userInstruction: assistant?.userInstruction
    })

    toast('Saved!')

    setLoading(false);
  }

  const OnDelete = async () => {
    setLoading(true);
    await DeleteAssistant({
      id: assistant?._id
    });
    setAssistant(null);
    setLoading(false);
  }

  return assistant && (
    <div className='p-5 bg-secondary border-l-[1px] h-screen'>
      <h2 className='font-bold text-xl'>Settings</h2>
      <BlurFade inView delay={0.25}>
        <div className='mt-4 flex gap-3'>
          <Image src={assistant?.image} alt={assistant?.name} width={100} height={100}
            className='rounded-xl h-[80px] w-[80px] object-cover'
          />
          <div>
            <h2 className='font-bold'>{assistant?.name}</h2>
            <h2 className='text-gray-700 dark:text-gray-300'>{assistant?.title}</h2>
          </div>
        </div>
      </BlurFade>
      <BlurFade inView delay={0.25 * 2}>
        <div className='mt-4'>
          <h2 className='text-gray-500'>Model:</h2>
          <Select defaultValue={assistant?.aiModelId} onValueChange={(value) => onHandleInputChange('aiModelId', value)}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              {AiModelOptions.map((model, index) => (
                <SelectItem key={index} value={model?.name}>
                  <div key={index} className='flex gap-2 items-center m-1'>
                    <Image src={model?.logo} alt={model.edenAi} width={20} height={20}
                      className='rounded-md'
                    />
                    <h2>{model?.name}</h2>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

        </div>
      </BlurFade>
      <BlurFade inView delay={0.25 * 3}>
        <div className='mt-4'>
          <h2 className='text-gray-500'>Instructions:</h2>
          <Textarea placeholder='Add Instruction' value={assistant?.userInstruction}
            className='bg-white'
            onChange={(e) => onHandleInputChange('userInstruction', e.target.value)}
          />
        </div>
      </BlurFade>

      <div className='absolute bottom-10 gap-5 flex right-5'>
        <ConfirmationAlert OnDelete={OnDelete}>
          <Button variant='ghost' disabled={loading}> <Trash /> Delete</Button>
        </ConfirmationAlert>
        <Button onClick={onSave} disabled={loading}>{loading ? <Loader2Icon className='animate-spin' /> : <Save />} Save</Button>
      </div>

    </div>
  )
}

export default AssistantSettings
