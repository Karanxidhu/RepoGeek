"use client";
import { redirect } from "next/navigation";
import React, { createContext, useEffect, useState } from "react";
export const DataContext = createContext({});


const BACKURL = process.env.NEXT_PUBLIC_BACKEND_URL

export const DataProvider = ({ children }) => {
    const [data, setData] = useState()
    const [user, setUser] = useState({})
    const [tree, setTree] = useState()
    const [file, setFile] = useState()
    const [response, setResponse] = useState()
    const [progress, setProgress] = useState(0)
    const [loading, setLoading] = useState(false)
    const GetUser = async () => {
        const token = await localStorage.getItem('token')
        console.log(token)
        const response = await fetch(`${BACKURL}/api/auth/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            }
        })
        const data = await response.json()
        console.log(data)
        setUser(data)
    }

    const GetRepos = async () => {
        const token = await localStorage.getItem('token')
        const response = await fetch(`${BACKURL}/api/Github/repos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            }
        })
        const data = await response.json()
        setData(data)
        console.log(data)
    }

    const GetTree = async (repo, branch="main") => {
        setFile(null)
        const token = await localStorage.getItem('token')
        const response = await fetch(`${BACKURL}/api/github/tree`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            },
            body: JSON.stringify({
                repo,
                branch
            })
        })
        const data = await response.json()
        setTree(data)
        console.log(data)
    }
    const GetTreeURL = async (repo) => {
        setFile(null)
        const token = await localStorage.getItem('token')
        const response = await fetch(`${BACKURL}/api/github/treeurl`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            },
            body: JSON.stringify({
                repo
            })
        })
        const data = await response.json()
        setTree(data)
        console.log(data)
    }

    const GetFile = async (repo: string, path: string) => {
        const token = await localStorage.getItem('token')
        const response = await fetch(`${BACKURL}/api/github/content`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            },
            body: JSON.stringify({
                repo,
                path
            })
        })
        const data = await response.json()
        setFile(data.content)
        console.log(data)
    }

    const llmRespose = async (content: string) => {
        setLoading(true)
        const token = await localStorage.getItem('token')
        setProgress(5);
        var count = 5
        setInterval(()=>{setProgress(count); count = count + 1}, 2500)
        const response = await fetch(`${BACKURL}/api/ollama/analyse`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            },
            body: JSON.stringify({
                content
            })
        })
        console.log(response)
        const data = await response.json()
        setResponse(data);
        setProgress(100)
        setLoading(false)
    }

    useEffect(() => {
        GetUser()
    }, [])

    return (
        <DataContext.Provider value={{ progress, loading, user, data, tree, file, response, GetRepos, GetTree, GetFile, setFile, llmRespose }}>
            {children}
        </DataContext.Provider>
    )
}