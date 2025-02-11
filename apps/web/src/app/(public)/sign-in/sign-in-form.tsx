'use client'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { signIn } from './action'
import { useFormState } from '@/hooks/use-form-state'

export function SignInForm() {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [_, handleSubmit, isPending] = useFormState(signIn, {
    withToast: true,
    onSuccessMessage: {
      message: 'Magic link enviado com sucesso! 🚀',
      description:
        'Verifique sua caixa de entrada e siga as instruções para acessar sua conta.',
    },
    onErrorMessage: {
      message: 'Algo deu errado! 😢',
      description: 'Verifique os campos e tente novamente.',
    },
  })

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="items-center justify-center space-y-1 text-center">
        <h1 className="text-2xl font-semibold">Bem vindo de volta</h1>
        <span className="text-muted-foreground text-xs">
          Informe o seu email para receber seu magic link
        </span>
      </div>
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="johndoe@acme.com"
          />
        </div>

        <Button type="submit" className="w-full gap-2" disabled={isPending}>
          Receber meu magic link
        </Button>
      </form>
    </div>
  )
}
