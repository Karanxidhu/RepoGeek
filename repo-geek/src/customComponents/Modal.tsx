import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

export function DialogDemo({ data }) {

  return (
    <Dialog>
      <DialogTrigger asChild className="fixed right-5 bottom-5 md:right-32 md:bottom-32 rounded-full cursor-pointer hover:translate-x-2 hover:-translate-y-2 hover:bg-zinc-100 hover:dark:bg-zinc-800 dark:hover:bg-zinc-800 duration-700 ease-in-out">
        <Image src="/llama.png" className="rounded-full border-2 border-zinc-300 p-2 h-14 w-14 md:h-28 md:w-28" alt="edit" width={100} height={100} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90%] h-[80%] overflow-scroll">
        <DialogHeader>
          <DialogTitle className="text-center">llm Response</DialogTitle>
          <DialogDescription className="text-center">
            Here's what the AI thinks about your code:
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 p-0 md:p-4 h-full overflow-y-scroll py-8 text-wrap">
          <ReactMarkdown rehypePlugins={[rehypeHighlight]} children={data} className="text-base sm:text-lg w-full break-words" />
        </div>
      </DialogContent>
    </Dialog>
  )
}
