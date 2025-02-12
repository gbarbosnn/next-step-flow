import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { PlusCircleIcon } from 'lucide-react'
import Link from 'next/link'

export default async function Home() {
  return (
    <div className="space-y-4 py-4">
      <Header />
      <main className="mx-auto w-full max-w-[1200px] space-y-4">
        <div className="flex justify-between pt-6">
          <h1 className="text-2xl font-bold">Suas propostas</h1>
          <Button asChild>
            <Link href="/proposals/create-proposal">
              <PlusCircleIcon className="size-4" />
              Nova proposta
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
