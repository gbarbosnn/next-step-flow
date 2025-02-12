import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { InterceptedSheetContent } from '@/components/intercepted-sheet-content'
import { ProposalForm } from '../../../proposals/create-proposal/proposal-form'

export default function CreateProposal() {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent>
        <SheetHeader>
          <SheetTitle>Criar Proposta</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <ProposalForm />
        </div>
      </InterceptedSheetContent>
    </Sheet>
  )
}
