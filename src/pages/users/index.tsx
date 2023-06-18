import { Role } from '@prisma/client'
import Modal from 'components/Modal'
import Spin from 'components/Spin'
import { useState } from 'react'
import { trpc } from 'utils/trpc'

const Users: React.FC = () => {
  const { data: users, refetch } = trpc.user.findAll.useQuery()

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
  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-2">Utilisateurs</h1>
      {!isLoading ? (
        <table className="table w-full text-lg border rounded-xl ">
          <thead>
            <tr>
              <th className="text-xl bg-mc text-white">Nom</th>
              <th className="text-xl bg-mc text-white">Date de création</th>
              <th className="text-xl bg-mc text-white">Rôle</th>
              <th className="text-xl bg-mc text-white"></th>
            </tr>
          </thead>
          <tbody>
            {users?.map((userA) => {
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
      ) : (
        <Spin />
      )}
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
