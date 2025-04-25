import React, { useContext, useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { AuthContext } from '@/context/AuthContext'
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { WalletIcon } from 'lucide-react';
import { DialogClose } from '@radix-ui/react-dialog';


function Profile({ openDialog, setOpenDialog }: any) {
    const { user } = useContext(AuthContext);

    const [maxTokens, setMaxTokens] = useState<number>(0);

    useEffect(() => {
        if (user?.orderId) {
            setMaxTokens(500000);
        } else {
            setMaxTokens(10000);
        }
    }, [user])

    return (
        <div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{ }</DialogTitle>
                        <DialogDescription>
                            <div>
                                <div className='flex items-center gap-4'>
                                    <Image src={user?.picture} alt='user' width={150} height={150}
                                        className='w-[50px] h-[50px] rounded-full object-cover'
                                    />
                                    <div>
                                        <h2 className='font-bold text-lg'>{user?.name}</h2>
                                        <h2 className='text-gray-500'>{user?.email}</h2>
                                    </div>
                                </div>
                                <hr className='my-3' />
                                <div className='flex flex-col gap-2'>
                                    <h2 className='font-bold'>Token Usage</h2>
                                    <h2>{user?.credits}/{maxTokens}</h2>
                                    <Progress value={(user?.credits / maxTokens) * 100} />
                                    <h2 className='flex justify-between font-bold mt-3 text-lg items-center'>Current Plan
                                        <span className='p-1 bg-gray-100 rounded-md px-2 font-normal mb-2'>{user?.orderId ? 'Pro Plan' : 'Free Plan'}</span></h2>
                                </div>
                                <div className='p-4 border rounded-xl'>
                                    <div className='flex justify-between items-center'>
                                        <div>
                                            <h2 className='font-bold text-lg'>Pro Plan</h2>
                                            <h2>500,000 Tokens</h2>
                                        </div>
                                        <h2 className='font-bold text-lg'>$10/ Month</h2>
                                    </div>
                                    <hr className='my-3' />
                                    <Button className='w-full'> <WalletIcon /> Upgrade (10$)</Button>
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default Profile
