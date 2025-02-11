import { auth } from '@/auth/auth'

export default async function Home() {
  const { name } = await auth()
  return <h1>Hello {name}</h1>
}
