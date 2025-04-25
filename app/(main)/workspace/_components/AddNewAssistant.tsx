import React, { useContext, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import AiAssistants, { ASSISTANT } from '../../ai-assistants/page'
import AiAssistantsList from '@/services/AiAssistantsList'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import AiModelOptions from '@/services/AiModelOptions'
import { Textarea } from '@/components/ui/textarea'
import AssistantAvatar from './AssistantAvatar'
import { toast } from 'sonner'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { AuthContext } from '@/context/AuthContext'
import { AssistantContext } from '@/context/AssistantContext'
import { Loader2Icon } from 'lucide-react'
import { DialogClose } from '@radix-ui/react-dialog'


const DEFAULT_ASSISTANT = {
    image: '/bug-fixer.avif',
    name: '',
    title: '',
    id: 0,
    instruction: '',
    userInstruction: '',
    sampleQuestions: [],
    aiModelId: ''
}

function AddNewAssistant({ children }: any) {

    const [selectedAssistant, setSelectedAssistant] = useState<ASSISTANT>(DEFAULT_ASSISTANT);
    const [loading, setLoading] = useState(false);

    const AddAssistant = useMutation(api.userAiAssistants.InsertSelectedAssistants);
    const { user } = useContext(AuthContext);
    const { assistant, setAssistant } = useContext(AssistantContext);

    const onHandleInputChange = (field: string, value: string) => {
        setSelectedAssistant((prev: any) => ({
            ...prev,
            [field]: value
        }))
    }

    const onSave = async () => {
        if (!selectedAssistant.name || !selectedAssistant.title || !selectedAssistant.userInstruction) {
            toast.error('Please fill all the fields')
            return;
        }
        setLoading(true);
        const result = await AddAssistant({
            records: [selectedAssistant],
            uid: user?._id
        })
        toast.success('Assistant added successfully')
        setAssistant(null);
        setLoading(false);
    }

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Assistant</DialogTitle>
                        <DialogDescription asChild>
                            <div className='grid grid-cols-3 gap-5 mt-5'>
                                <div className='mt-5 border-r p-3'>
                                    <Button variant={'secondary'} size={'sm'} className='w-full'
                                        onClick={() => setSelectedAssistant(DEFAULT_ASSISTANT)}
                                    >+ Create New Assistant</Button>
                                    <div className='mt-2'>
                                        {AiAssistantsList.map((assistant, index) => (
                                            <div className='p-2 hover:bg-secondary  flex gap-2 items-center cursor-pointer rounded-xl'
                                                onClick={() => setSelectedAssistant(assistant)}
                                            >
                                                <Image src={assistant.image} width={60} height={60} alt='assistant'
                                                    className='rounded-lg object-cover w-[35px] h-[35px]'
                                                />
                                                <h2 className='text-xs'>{assistant.title}</h2>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className='col-span-2'>
                                    <div className='flex gap-5'>
                                        {selectedAssistant &&
                                            <AssistantAvatar selectedImage={(v: string) => onHandleInputChange('image', v)}>
                                                <Image src={selectedAssistant?.image} alt='assistant' width={150} height={150}
                                                    className='rounded-xl object-cover w-[100px] h-[100px]'
                                                />
                                            </AssistantAvatar>
                                        }
                                        <div className='flex flex-col gap-3 w-full'>
                                            <Input placeholder='Name of the Assistant'
                                                className='w-full'
                                                onChange={(event) => onHandleInputChange('name', event.target.value)}
                                                value={selectedAssistant?.name}
                                            />
                                            <Input placeholder='Title of the Assistant'
                                                className='w-full'
                                                value={selectedAssistant?.title}
                                                onChange={(event) => onHandleInputChange('title', event.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className='mt-4'>
                                        <h2 className='text-gray-500'>Model:</h2>
                                        <Select defaultValue={selectedAssistant?.aiModelId} onValueChange={(value) => onHandleInputChange('aiModelId', value)}>
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
                                    <div className='mt-5'>
                                        <h2 className='text-gray-500'>Instruction:</h2>
                                        <Textarea placeholder='Add Instructions'
                                            value={selectedAssistant?.userInstruction}
                                            className='h-[200px]'
                                            onChange={(event) => onHandleInputChange('userInstruction', event.target.value)}
                                        />
                                    </div>

                                    <div className='flex justify-end gap-3 mt-5'>
                                        <DialogClose>
                                            <Button variant={'secondary'}>Cancel</Button>
                                        </DialogClose>
                                        <Button disabled={loading} onClick={onSave}>{loading && <Loader2Icon className='animate-spin' />}Save</Button>
                                    </div>

                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default AddNewAssistant
