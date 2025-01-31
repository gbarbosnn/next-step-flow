import type { AbilityBuilder } from '@casl/ability'
import type { AppAbility } from './index'
import type { User } from './models/user.js'
import type { Role } from './roles'

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN(user, { can, cannot }) {
    can('manage', 'all')
  },

  MEMBER(user, { can }) {
    can('get', 'User')
    can(['update'], 'User', { id: { $eq: user.id } })

    can('create', 'Proposal')
    can(['get', 'delete', 'update'], 'Proposal', { ownerId: { $eq: user.id } })
  },

  GUEST(user, { can }) {
    can('create', 'Proposal')
    can(['get', 'delete', 'update'], 'Proposal', { ownerId: { $eq: user.id } })
  },
}
