import { Role } from '@prisma/client'
import Modal from 'components/Modal'
import Spin from 'components/Spin'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { trpc } from 'utils/trpc'

const Users: React.FC = () => {
  const searchParams = useSearchParams()
  const search = searchParams.get('search') as Role | null
  const { data: users, refetch } = trpc.user.findAll.useQuery({})

  const { mutate: updateRole, isLoading } = trpc.user.updateRole.useMutation({
    onSuccess: () => {
      refetch()
    },
  })

  const [user, setUser] = useState<{ role: Role; email: string }>({
    role: 'USER',
    email: '',
  })

  const [visible, setVisible] = useState(false)

  const [filters, setFilters] = useState<{
    email: string
    role: Role | ''
  }>({
    email: '',
    role: search || '',
  })

  if (isLoading || !users) {
    return <Spin />
  }

  const filteredUsers = users.filter((user) => {
    const userEmail = user.email?.toLowerCase() || ''
    const filterEmail = filters.email?.toLowerCase() || ''

    return (
      (filters.email === '' ? true : userEmail.includes(filterEmail)) &&
      (filters.role === '' ? true : filters.role === user.role)
    )
  })
  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-2">Utilisateurs</h1>
      <div className="flex border rounded-xl p-4 mb-4 space-x-4 items-center">
        <div className="space-y-2 w-1/3">
          <p className="text-mc">Recherche</p>
          <input
            className="input input-bordered w-full"
            type="text"
            value={filters.email}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
          />
        </div>
        <div className="space-y-2 w-full">
          <p className="text-mc">Rôle</p>

          <select
            className="select select-bordered w-full"
            value={filters.role}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                role: e.target.value as Role,
              }))
            }
          >
            <option value="">Tous</option>
            {Object.values(Role).map((role) => (
              <option key={role} value={role}>
                {
                  {
                    REVIEWER: 'Validateur',
                    ADMIN: 'Admin',
                    PARTNER: 'Partenaire',
                    USER: 'Utilisateur',
                  }[role]
                }
              </option>
            ))}
          </select>
        </div>
      </div>
      <table className="table w-full text-lg">
        <thead>
          <tr>
            <th className="text-xl bg-mc text-white rounded-tl-xl">Email</th>
            <th className="text-xl bg-mc text-white">Date de création</th>
            <th className="text-xl bg-mc text-white">Rôle</th>
            <th className="text-xl bg-mc text-white rounded-tr-xl"></th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((userA) => {
            return (
              <tr key={userA.id}>
                <td>{userA.email}</td>
                <td>{userA.createdAt.toLocaleDateString()}</td>
                <td>{userA.role}</td>

                <th className="text-center">
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => {
                      setUser({
                        email: userA.email || '',
                        role: userA.role,
                      })
                      setVisible(true)
                    }}
                  >
                    Modifier le rôle
                  </button>
                </th>
              </tr>
            )
          })}
        </tbody>
      </table>

      <Modal open={visible}>
        <h3 className="font-bold text-lg">Modifier le rôle</h3>
        <select
          value={user.role}
          onChange={(e) =>
            setUser({
              email: user.email,
              role: e.target.value as Role,
            })
          }
          className="select select-bordered w-full"
        >
          {Object.keys(Role).map((role) => {
            return (
              <option value={role} key={role}>
                {
                  {
                    ADMIN: 'Administrateur',
                    USER: 'Utilisateur',
                    PARTNER: 'Partenaire',
                    REVIEWER: 'Validateur',
                  }[role]
                }
              </option>
            )
          })}
        </select>
        <div className="modal-action">
          <button
            className="btn btn-secondary"
            onClick={() => {
              setVisible(false)
            }}
          >
            Annuler
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              const { email, role } = user
              updateRole({
                email,
                role,
              })
              setVisible(false)
            }}
          >
            Valider
          </button>
        </div>
      </Modal>
    </>
  )
}

export default Users
