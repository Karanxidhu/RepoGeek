"use client"
import React, { useContext } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { useRouter } from 'next/navigation'


const LoginCard = () => {
    const router = useRouter()
    const handleGoogle = () => {
        router.push(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`)
    }
    const handleGiHub = (e) => {
        e.preventDefault()
        router.push(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/github`)
    }
    return (
        <Card className="w-full md:w-[550px] mx-auto">
            <CardHeader>
                <CardTitle className='md:text-2xl text-lg text-center'>Login to continue </CardTitle>
                <CardDescription className='md:text-sm text-xs text-center'>Ready to take your codingskills to the next level?  <span className='font-bold'>Login now </span>and see what Repo Geek can do for you!</CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center">
                        
                        <Button onClick={handleGoogle} className='w-[70%] mx-auto space-x-3 group flex justify-center group-hover:bg-white bg-zinc-950 border items-center'>
                            <Image src="/google.png" width={24} height={24} alt="google" />
                            <p className='text-white group group-hover:text-zinc-950 duration-100 text-center font-semibold '>Login with Google</p>
                        </Button>
                        <p className=' text-center font-semibold my-1 md:my-2'>or</p>
                        <Button onClick={handleGiHub} className='w-[70%] mx-auto space-x-3 group flex justify-center group-hover:bg-white bg-zinc-950 border items-center'>
                        <Image src="/github.png" width={24} height={24} alt="google" />
                            <p className='text-white group group-hover:text-zinc-950 duration-100 text-center font-semibold '>Login with GitHub</p>
                        </Button> 
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default LoginCard