'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/use-form-state'
import { createProposalAction } from './action'
import { Textarea } from '@/components/ui/textarea'

export function ProposalForm() {
  const [{ errors }, handleSubmit, isPending] = useFormState(
    async (formData: FormData) => {
      const problem = formData.get('problem')?.toString().trim()
      const solution = formData.get('solution')?.toString().trim()
      const benefits = formData.get('benefits')?.toString().trim()

      if (!problem || !solution || !benefits) {
        return createProposalAction(formData)
      }

      const description = `${problem}/${solution}/${benefits}`

      formData.set('description', description)

      const result = await createProposalAction(formData)

      if (typeof result === 'string' || typeof result === 'number') {
        return {
          success: false,
          message: result,
          errors: null,
        }
      }

      return result
    },
    {
      withToast: true,
      onSuccessMessage: {
        message: 'Proposta criada com sucesso! 🚀',
        description: 'Você pode acompanhar o andamento na página inicial.',
      },
      onErrorMessage: {
        message: 'Algo deu errado! 😢',
        description: 'Verifique os campos e tente novamente.',
      },
    },
    '/',
  )

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <Label htmlFor="title">Dê um nome à sua proposta</Label>
        <Input name="title" id="title" />
        {errors?.title && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.title[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="problem">Qual é o problema ou oportunidade?</Label>
        <Textarea
          id="problem"
          name="problem"
          placeholder="Exemplo: Atualmente, o processo de geração de relatórios mensais é manual e consome muito tempo."
          className="min-h-[100px]"
        />
        {errors?.problem && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.problem[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="solution">
          Qual é a sua ideia para resolver esse problema?
        </Label>
        <Textarea
          id="solution"
          name="solution"
          placeholder="Exemplo: Implementar uma ferramenta de automação que gere os relatórios automaticamente."
          className="min-h-[100px]"
        />
        {errors?.solution && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.solution[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="benefits">Quais são os benefícios esperados?</Label>
        <Textarea
          id="benefits"
          name="benefits"
          placeholder="Exemplo: Redução de 80% no tempo gasto com relatórios e maior precisão nos dados apresentados."
          className="min-h-[100px]"
        />
        {errors?.benefits && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.benefits[0]}
          </p>
        )}
      </div>

      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? 'Criando...' : 'Criar proposta'}
      </Button>
    </form>
  )
}
