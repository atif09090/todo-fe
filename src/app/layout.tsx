import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/provider/theme-provider'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Todo App',
  description: 'A simple todo application with authentication',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  )
}

