"use client"
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, Suspense } from 'react'

const LoginContent = () => {
    const params = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        const token = params.get('token')
        if (token) {
            localStorage.setItem('token', token)
            router.push('/home')
        }
    }, [params, router])

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
    )
}

const LoginPage = () => {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    )
}

export default LoginPage