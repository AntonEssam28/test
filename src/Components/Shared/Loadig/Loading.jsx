import { Spinner, spinner } from '@heroui/react'
import React from 'react'


export default function Loading() {
  return (
    <>
    <div className='h-screen flex justify-center items-center'>
        <Spinner classNames={{label: "text-foreground mt-4"}} size='lg' label="Loading" variant="spinner" />
    </div>
    </>
  )
}
