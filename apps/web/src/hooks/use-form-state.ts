import { redirect } from 'next/navigation'
import { useState, useTransition, type FormEvent } from 'react'
import { toast } from 'sonner'

interface FormState {
  success: boolean
  message: string | null
  errors: Record<string, string[]> | null
}

interface Toasts {
  withToast: boolean
  onSuccessMessage: { message: string; description: string }
  onErrorMessage: { message: string; description: string }
}

export function useFormState(
  action: (data: FormData) => Promise<FormState>,
  hasToast: Toasts,
  redirectTo?: string,
  initialState?: FormState,
) {
  const { onErrorMessage, onSuccessMessage, withToast } = hasToast
  const [isPending, startTransition] = useTransition()
  const [formState, setFormState] = useState(
    initialState ?? {
      success: false,
      message: null,
      errors: null,
    },
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)

    startTransition(async () => {
      const result = await action(data)

      if (withToast) {
        if (result.success) {
          toast.success(onSuccessMessage.message, {
            description: onSuccessMessage.description,
          })

          form.reset()

          if (redirectTo) {
            redirect(redirectTo)
          }
        }

        if (result.errors) {
          toast.error(onErrorMessage.message, {
            description: onErrorMessage.description,
          })
        }

        if (result.message) {
          toast.error('Algo deu errado! 😢', {
            description: formState.message,
          })
        }
      }

      setFormState(result)
    })
  }

  return [formState, handleSubmit, isPending] as const
}
