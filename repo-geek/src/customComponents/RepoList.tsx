import React, { useContext, useEffect } from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from '@/components/ui/button'
import { ChevronsUpDown } from 'lucide-react'
import { DataContext } from '@/context/DataContext'
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from 'next/navigation'

const RepoList = ({username}) => {
    useEffect(()=>{
        GetRepos()
    },[])
    const router = useRouter()
    const { data, GetRepos,GetTree } = useContext(DataContext)
    const [isOpen, setIsOpen] = React.useState(false)
    return (
        <>
        {data &&<Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="w-[350px] space-y-2 mt-12"
        >
            <div className="flex items-center justify-between space-x-4 px-4">
                <h4 className="text-sm font-semibold">
                    @{username} shared {data.length} repositories
                </h4>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                        <ChevronsUpDown className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                    </Button>
                </CollapsibleTrigger>
            </div>
            <div className="rounded-md border px-4 py-3 font-mono text-sm cursor-pointer" onClick={()=>router.push(`/repo/${data[0].name}?branch=${data[0].default_branch}&full_name=${data[0].full_name}&pub=false`)}>
                @{username}/{data[0].name}
            </div>
            <CollapsibleContent className="space-y-2">
            <ScrollArea className='h-[200px] w-[330px] md:w-[350px] mx-auto rounded-md border p-4 '>
            {
                    data.map((repo:any, index:number)=>{
                        if(index === 0) return null
                        return <div onClick={()=>{
                            router.push(`/repo/${repo.name}?branch=${repo.default_branch}&full_name=${repo.full_name}&pub=false`)}} className="cursor-pointer rounded-md border px-4 py-3 font-mono text-sm">
                            @{username}/{repo.name}
                        </div>
                    })
            }
                </ScrollArea>
            </CollapsibleContent>
        </Collapsible>}
        </>

    )
}

export default RepoList