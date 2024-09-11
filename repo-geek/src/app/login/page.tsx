"use client"
import {redirect, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

const page = () => {
    const params = useSearchParams()
    useEffect(() => {
        const token = params.get('token')
        localStorage.setItem('token', token)
        redirect('/home')
    }, [])
  return (
    <div></div>
  )
}

export default page