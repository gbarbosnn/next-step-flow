# 📁 Estrutura de Pastas e Arquivos do Pacote

Este documento descreve a estrutura do pacote, detalhando cada componente e sua função no sistema de permissões baseado na biblioteca **CASL** (`@casl/ability`). O sistema segue um design modular para facilitar a manutenção e extensão.

---

## 📂 Estrutura de Pastas

```
src
  ├── models
  │     ├── proposal.ts       # Modelo de dados para Proposta
  │     └── user.ts           # Modelo de dados para Usuário
  ├── subjects
  │     ├── proposal.ts       # Definição de sujeitos (subjects) para Proposta
  │     └── user.ts           # Definição de sujeitos (subjects) para Usuário
  ├── index.ts                # Ponto de entrada principal do pacote
  ├── permissions.ts          # Lógica de permissões por papel (role)
  └── roles.ts                # Definição dos papéis (roles) disponíveis
```

---

## 📜 Descrição dos Arquivos

### 🏗 `models/proposal.ts`

Define o modelo de dados para a entidade `Proposal`.

```typescript
import { z } from 'zod'

export const proposalSchema = z.object({
  __typename: z.literal('Proposal').default('Proposal'),
  id: z.string(),
  ownerId: z.string(),
})

export type Proposal = z.infer<typeof proposalSchema>
```

### 👤 `models/user.ts`

Define o modelo de dados para a entidade `User`.

```typescript
import { z } from 'zod'

export const userSchema = z.object({
  __typename: z.literal('User').default('User'),
  id: z.string(),
  role: z.enum(['ADMIN', 'MEMBER', 'GUEST']),
})

export type User = z.infer<typeof userSchema>
```

### 🎯 `subjects/proposal.ts`

Define os sujeitos (subjects) para a entidade `Proposal`.

```typescript
import { z } from 'zod'
import { proposalSchema } from '../models/proposal'

export const proposalSubject = z.tuple([
  z.enum([
    'manage',
    'get',
    'create',
    'approve',
    'change_status',
    'update',
    'delete',
  ]),
  z.union([z.literal('Proposal'), proposalSchema]),
])

export type ProposalSubject = z.infer<typeof proposalSubject>
```

### 🔍 `subjects/user.ts`

Define os sujeitos (subjects) para a entidade `User`.

```typescript
import { z } from 'zod'
import { userSchema } from '../models/user'

export const userSubject = z.tuple([
  z.enum(['manage', 'get', 'update']),
  z.union([z.literal('User'), userSchema]),
])

export type UserSubject = z.infer<typeof userSubject>
```

### 🚀 `index.ts`

Ponto de entrada principal do pacote.

```typescript
import {
  createMongoAbility,
  CreateAbility,
  MongoAbility,
  AbilityBuilder,
} from '@casl/ability'
import type { User } from './models/user'
import { permissions } from './permissions'
import { userSubject } from './subjects/user'
import { proposalSubject } from './subjects/proposal'
import { z } from 'zod'

export * from './models/user'
export * from './models/proposal'
export * from './roles'

const appAbilitiesSchema = z.union([
  userSubject,
  proposalSubject,
  z.tuple([z.literal('manage'), z.literal('all')]),
])

type AppAbilities = z.infer<typeof appAbilitiesSchema>
export type AppAbility = MongoAbility<AppAbilities>

export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility)
  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`Permissions for role ${user.role} not found`)
  }
  permissions[user.role](user, builder)
  return builder.build({
    detectSubjectType: (subject) => subject.__typename,
  })
}
```

### 🔐 `permissions.ts`

Define as regras de permissão para cada papel.

```typescript
import type { AbilityBuilder } from '@casl/ability'
import type { AppAbility } from './index'
import type { User } from './models/user'
import type { Role } from './roles'

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN(user, { can }) {
    can('manage', 'all')
  },
  MEMBER(user, { can }) {
    can('get', 'User')
    can('update', 'User', { id: user.id })
    can('create', 'Proposal')
    can(['get', 'delete', 'update'], 'Proposal', { ownerId: user.id })
  },
  GUEST(user, { can }) {
    can('create', 'Proposal')
    can(['get', 'delete', 'update'], 'Proposal', { ownerId: user.id })
  },
}
```

### 🎭 `roles.ts`

Define os papéis disponíveis no sistema.

```typescript
import { z } from 'zod'

export const roleSchema = z.enum(['ADMIN', 'MEMBER', 'GUEST'])
export type Role = z.infer<typeof roleSchema>
```

---

## 🔑 Tabela de Permissões

| Papel  | Entidade | Ações Permitidas                    | Condições             |
| ------ | -------- | ----------------------------------- | --------------------- |
| ADMIN  | Todos    | `manage`                            | Nenhuma               |
| MEMBER | User     | `get`, `update`                     | `id === user.id`      |
| MEMBER | Proposal | `create`, `get`, `delete`, `update` | `ownerId === user.id` |
| GUEST  | Proposal | `create`, `get`, `delete`, `update` | `ownerId === user.id` |

---

## 🔄 Fluxo de Funcionamento

1. **Definição de Modelos**:

   - Os modelos `User` e `Proposal` definem a estrutura dos dados.

2. **Definição de Sujeitos**:

   - Os sujeitos determinam quais ações podem ser executadas sobre cada entidade.

3. **Definição de Papéis**:

   - Os papéis são configurados em `roles.ts` e suas permissões atribuídas em `permissions.ts`.

4. **Criação de Habilidades**:

   - `defineAbilityFor(user)` gera habilidades conforme o papel do usuário.

5. **Uso na Aplicação**:
   - As habilidades são verificadas antes da execução de determinadas ações.
