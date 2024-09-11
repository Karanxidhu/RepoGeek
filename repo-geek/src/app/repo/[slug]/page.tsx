"use client";
import React, { useContext, useEffect, useState } from 'react'
import { File, Folder, Tree } from "@/components/magicui/file-tree";
import WordPullUp from "@/components/magicui/word-pull-up";
import CodePreview from '@/customComponents/CodePreviewer';
import CodePreviewer from '@/customComponents/CodePreviewer';
import { DataContext } from '@/context/DataContext';
import HyperText from "@/components/magicui/hyper-text";
import { useSearchParams } from 'next/navigation';
import ShineBorder from "@/components/magicui/shine-border";
import { useTheme } from 'next-themes';
import { cn } from "@/lib/utils";
import AnimatedGridPattern from "@/components/magicui/animated-grid-pattern";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import AnimatedShinyText from "@/components/magicui/animated-shiny-text";
import { DialogDemo } from '@/customComponents/Modal';
import { Progress } from "@/components/ui/progress"



const page = ({ params }) => {
    const URLparams = useSearchParams()
    const theme = useTheme();
    const branch = URLparams.get('branch')
    const pub = URLparams.get('pub')
    const [fileName, setFileName] = useState()
    const full_name = URLparams.get('full_name')
    useEffect(() => {
        if(pub == 'false'){
            GetTree(full_name, branch)
        }
    }, [])
    const { GetTree, tree, GetFile, file, llmRespose, response, progress, loading, GetTreeURL} = useContext(DataContext)
    console.log(params.slug)
    function renderTree(elements: any) {
        return elements.map((element: any, index: number) => {
            if (element.children && element.children.length > 0) {
                return (
                    <Folder key={index} element={element.name} value={element.id}>
                        {renderTree(element.children)} {/* Recursive call */}
                    </Folder>
                );
            } else {
                return (
                    <File key={index} value={element.id} >
                        <p onClick={() => { GetFile(full_name, element.actualPath); setFileName(element.name) }}>{element.name}</p>
                    </File>
                );
            }
        });
    }
    return (
        <div className='relative min-h-screen flex flex-col justify-center p-5 md:p-12'>
            <WordPullUp
                className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300 bg-clip-text text-center md:text-8xl text-4xl font-semibold leading-none text-transparent dark:from-white dark:to-black py-12"
                words="Your Repo"
            />
            {loading && <Progress value={progress} className='w-[250px] mx-auto' />}
            {file && <div className='flex justify-center w-full items-center mt-10'>
                {!loading && <div
                    className={cn(
                        "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800 mx-auto my-8  md:visible md:relative invisible absolute",
                    )}
                >
                    <AnimatedShinyText className=" inline-flex items-center justify-center px-4 py-1 transition duration-2000 ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                        <span onClick={() => { llmRespose(file) }}>✨ Analyse using AI</span>
                        <ArrowRightIcon className="ml-1 size-3 transition-transform duration-700 ease-in-out group-hover:translate-x-0.5" />
                    </AnimatedShinyText>
                </div>}
            </div>}
            {tree && <div className='flex flex-col md:flex-row'>
                <div className="relative flex h-[70%] flex-col w-full md:max-w-fit items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl ">
                    {tree && <Tree
                        className="p-2 overflow-hidden rounded-md bg-background"
                        initialSelectedId="7"
                        initialExpandedItems={[
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                            "10",
                            "11",
                        ]}
                        elements={tree}
                    >
                        {
                            renderTree(tree)
                        }
                    </Tree>}
                </div>
                {file ?
                    <ShineBorder color={theme.theme === "dark" ? "white" : "#09090b"} className='overflow-scroll max-h-fit flex flex-col md:w-[65%] mt-8 md:mt-0 w-full md:p-5 bg-zinc-950 rounded-xl border-2 mx-auto font-mono font-medium z-10'>
                        {!loading && <div
                            className={cn(
                                "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800 mx-auto my-8 visible relative md:invisible md:absolute",
                            )}
                        >
                            <AnimatedShinyText className=" inline-flex items-center justify-center px-4 py-1 transition duration-2000 ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                                <span onClick={() => { llmRespose(file) }}>✨ Analyse using AI</span>
                                <ArrowRightIcon className="ml-1 size-3 transition-transform duration-700 ease-in-out group-hover:translate-x-0.5" />
                            </AnimatedShinyText>
                        </div>}
                        <p className="text-center scroll-m-20 text-xl font-semibold tracking-tight p-4">{fileName}</p>
                        <CodePreviewer />
                    </ShineBorder> :
                    <div className=' flex justify-center mt-12 h-full items-center w-[80%]'>
                        <HyperText
                            className="text-xl md:text-4xl text-center font-bold text-black dark:text-white py-12 md:py-0"
                            text="Select a file"
                        />
                    </div>
                }
            </div>}
            <AnimatedGridPattern
                numSquares={30}
                maxOpacity={0.1}
                duration={3}
                repeatDelay={1}
                className={cn(
                    "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
                    "inset-x-0 inset-y-[-50%] h-[100%] skew-y-12 z-0",
                )}
            />
            {response && <DialogDemo data={response} />}
        </div>
    )
}

export default page