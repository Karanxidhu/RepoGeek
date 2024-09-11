import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"
import "./globals.css";
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Repo Geek",
  description: "Unlock the potential of your repositories with Repo Geek. Whether you're a seasoned developer or just starting out, our tool offers an in-depth analysis of your GitHub or any public repo, identifying issues, optimizing code quality, and providing actionable insights—all powered by the cutting-edge Llama3.1 AI model.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
          "min-h-screen font-sans antialiased bg-background",
          fontSans.variable
        )}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
          {children}
          </ThemeProvider>
          </body>
    </html>
  );
}
