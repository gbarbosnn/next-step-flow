import { isAuthenticated } from '@/auth/auth'
import { redirect } from 'next/navigation'

export default async function AppLayout({
  children,
  sheet,
}: Readonly<{
  children: React.ReactNode
  sheet: React.ReactNode
}>) {
  const userAuthenticated = await isAuthenticated()

  if (!userAuthenticated) {
    redirect('/sign-in')
  }
  return (
    <>
      {children}
      {sheet}
    </>
  )
}
