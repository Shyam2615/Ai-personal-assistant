import React from 'react'
import AssistantList from './_components/AssistantList'
import Settings from './_components/AssistantSettings'
import CharUi from './_components/ChatUi'

function Workspace() {
  return (
    <div className='h-screen w-full fixed'>
      <div className='grid grid-cols-5'>
        <div className='hidden md:block'>
            <AssistantList />
        </div>
        <div className='md:col-span-4 lg:col-span-3'>
            <CharUi />
        </div>
        <div className='hidden lg:block'>
            <Settings />
        </div>
      </div>
    </div>
  )
}

export default Workspace
