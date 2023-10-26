import Modal from 'components/Modal'
import { signOut } from 'next-auth/react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { trpc } from 'utils/trpc'

const Infos: React.FC = () => {
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false)
  const { mutate: deleteAccount } = trpc.user.deleteAccount.useMutation({
    onSuccess: () => {
      toast.success('Votre compte a bien été supprimé')
      signOut()
    },
    onError: () => {
      toast.error('Pas de compte à supprimer')
    },
  })
  return (
    <div className="space-y-8">
      <h1 className="text-3xl text-mc">Informations</h1>
      <div className="space-y-4">
        <p>
          Ce site permet à <strong className="text-mc">MIAGE Connection</strong> de
          récolter des CV afin de les diffuser aux partenaires de la fédération qui
          recherchent activement des étudiants en MIAGE.
        </p>
        <h2 className="text-xl text-mc ">Confidentialité des données</h2>
        <p>
          Lorsque vous déposez votre CV, nous traitons vos informations avec la plus
          grande confidentialité et dans le respect de la réglementation en vigueur sur la
          protection des données personnelles. Vos informations ne seront utilisées que
          dans le cadre de notre processus de mise en relation avec les employeurs
          potentiels.
        </p>
        <p>
          Si vous souhaitez supprimer votre compte ainsi que toutes les données liées,
          cliquez sur ce lien:{' '}
          <button
            onClick={() => setDeleteConfirmVisible(true)}
            className="btn btn-link text-red-600 p-0 normal-case"
          >
            supprimer mon compte définitivement
          </button>
        </p>
      </div>
      <h1 className="text-3xl text-mc">Partenaires</h1>

      <Modal open={deleteConfirmVisible}>
        <div className="space-y-4">
          <p>Êtes-vous sûr de vouloir supprimer votre compte ?</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setDeleteConfirmVisible(false)}
              className="btn btn-primary"
            >
              Non
            </button>
            <button onClick={() => deleteAccount()} className="btn btn-error">
              Oui
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Infos
