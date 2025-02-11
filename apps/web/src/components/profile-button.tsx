import { ChevronDown, LogOutIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { auth } from '@/auth/auth'

function getInitials(name: string) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
}

export async function ProfileButton() {
  const { name, email } = await auth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 outline-none">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium">{name}</span>
          <span className="text-muted-foreground text-xs">{email}</span>
        </div>
        <Avatar>
          <AvatarImage src="" />
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
        <ChevronDown className="text-muted-foreground size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="mt-2 w-48">
        <DropdownMenuItem asChild>
          <a href="/api/auth/sign-out">
            <LogOutIcon className="mr-2 size-4 text-red-400" />
            Sair
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
