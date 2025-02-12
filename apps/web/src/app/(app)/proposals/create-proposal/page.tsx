import { Header } from '@/components/header'
import { ProposalForm } from './proposal-form'

export async function generateStaticParams() {
  return [{ slug: 'create-proposal' }]
}

export default function CreateProposal() {
  return (
    <div className="space-y-4 py-4">
      <Header />
      <main className="mx-auto w-full max-w-[1200px] space-y-4">
        <h1 className="text-2xl font-bold">Criar Proposta</h1>
        <ProposalForm />
      </main>
    </div>
  )
}
