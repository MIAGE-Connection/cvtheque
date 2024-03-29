import { CVDetails } from 'components/CVDetails'
import { useState } from 'react'
import { FormProvider } from 'react-hook-form'
import Modal from '../Modal'
import { AssociationFields } from './AssociationFields'
import { EntrepriseFields } from './EnterpriseFields'
import { ProfileFields } from './ProfileFields'
import { SchoolFields } from './SchoolFields'
import { SkillFields } from './SkillFields'
import { AddCandidatureInput, Props, TabType, useCandidatureForm } from '../utils'
import { toast } from 'react-toastify'
import { getCompetencesByType } from 'utils'

const Candidature: React.FC<Props> = ({ initialValues }) => {
  const [checked, setChecked] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)
  const [candidature, setCandidature] = useState<AddCandidatureInput | undefined>()
  const [activeTab, setActiveTab] = useState<TabType>(TabType.profile)

  const {
    checkValidity,
    register,
    handleSubmit,
    control,
    errors,
    getValues,
    onSubmit,
    isSubmitLoading,
    methods,
  } = useCandidatureForm({
    initialValues,
    setVisible,
  })

  return (
    <>
      <div className="sm:m-4 space-y-2">
        <div>
          <h1 className="text-lg font-semibold text-mc">
            Bienvenue sur le site de dépôt de CV de l&apos;association MIAGE Connection.
            Nous vous invitons à compléter le formulaire ci-dessous afin que le bureau
            puisse éventuellement vous faire un retour avant publication.
          </h1>
        </div>
        {/* Medium screen and plus */}
        <div className="hidden lg:flex space-x-8 justify-center items-baseline">
          {Object.values(TabType).map((type) => (
            <div
              key={type}
              onClick={async () => {
                const canChange = await checkValidity(activeTab)
                if (canChange) {
                  setActiveTab(type)
                } else {
                  toast.error('Veuillez corriger les erreurs')
                }
              }}
            >
              <button
                className={`${
                  activeTab === type
                    ? 'font-bold text-mc  border-b-2 border-mc text-xl'
                    : 'border-b-[1px] border-b-gray-700 text-lg'
                }`}
              >
                {
                  {
                    profile: 'Profil',
                    experiences: 'Expériences',
                    schools: 'Parcours scolaire',
                    skills: 'Compétences',
                    associations: 'Parcours associatif',
                    other: 'Loisirs',
                  }[type]
                }
              </button>
            </div>
          ))}
        </div>

        <div className="sm:p-2">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div id="title" className="justify-center flex">
                <div className="form-control w-4/6 ">
                  <label className="label">
                    <span className="label-text text-xl font-bold text-mc">
                      Titre du poste recherché
                    </span>
                  </label>
                  <input
                    className="input input-bordered w-full "
                    placeholder="..."
                    type="text"
                    {...register('title')}
                    key="firstName"
                  />
                  <label className="label">
                    <span className="label-text-alt text-mc">
                      {errors.title?.message}
                    </span>
                  </label>
                </div>
              </div>
              {
                {
                  profile: <ProfileFields {...{ control, register }} />,
                  experiences: <EntrepriseFields {...{ control, register }} />,
                  schools: <SchoolFields {...{ control, register }} />,
                  skills: <SkillFields {...{ control, register }} />,
                  associations: <AssociationFields {...{ control, register }} />,
                  other: (
                    <div id="freetime" className="justify-center flex">
                      <div className="form-control w-11/12 lg:w-4/6 ">
                        <label className="label">
                          <span className="label-text text-xl font-bold text-mc">
                            Loisirs & activités
                          </span>
                        </label>
                        <textarea
                          className="textarea textarea-bordered w-full"
                          placeholder="..."
                          {...register('passions')}
                          key="passions"
                        />
                      </div>
                    </div>
                  ),
                }[activeTab]
              }
              {/* Mobile screen */}
              <div className="flex lg:hidden space-x-8 justify-center items-baseline">
                {Object.values(TabType).map((type, i) => (
                  <div key={type} onClick={() => setActiveTab(type)}>
                    <button
                      className={`${
                        activeTab === type
                          ? 'font-bold text-mc  border-b-2 border-mc text-3xl'
                          : 'border-b-[1px] border-b-gray-700 text-2xl'
                      }`}
                      type="button"
                    >
                      {i + 1}
                    </button>
                  </div>
                ))}
              </div>

              <div className="lg:pr-4 lg:fixed lg:right-0 lg:bottom-2">
                <div className="space-x-2 flex justify-center mt-16">
                  <button
                    type="button"
                    className="btn btn-info hidden lg:inline-flex"
                    disabled={false}
                    onClick={() => {
                      setCandidature(getValues())
                      setChecked((prev) => !prev)
                    }}
                  >
                    {checked ? 'Retour' : 'Prévisualiser'}
                  </button>

                  <button
                    onClick={async () => {
                      const canSave = await checkValidity(activeTab)
                      if (canSave) {
                        setVisible(true)
                      } else {
                        toast.error('Veuillez corriger les erreurs')
                      }
                    }}
                    type="button"
                    className="btn btn-primary"
                  >
                    Sauvegarder
                  </button>
                </div>
              </div>
              <Modal open={visible} style={'lg:!max-w-1/2'}>
                <h3 className="font-bold text-2xl text-mc">Information</h3>
                <div className="space-y-2 text-lg">
                  <p className="text-wrap">
                    Nous accordons une grande importance à la qualité et à la pertinence
                    des CV soumis sur notre plateforme. Afin de garantir cela, tous les CV
                    seront soumis à une <strong className="font-bold">validation</strong>{' '}
                    rigoureuse par le bureau national de l&apos;association{' '}
                    <strong className="text-mc">MIAGE Connection</strong>.
                  </p>
                  <p>
                    Cette procédure de validation vise à assurer que seuls les CV qui
                    répondent aux critères spécifiques de l&apos;association seront mis à
                    disposition des employeurs. L&apos;équipe du bureau national examinera
                    attentivement chaque CV pour évaluer sa conformité avec les exigences
                    de l&apos;association.
                  </p>
                  <p>
                    <strong>
                      Chaque modification apportée sur un CV déjà publié entraîne une
                      nouvelle validation.
                    </strong>
                  </p>
                  <h3 className="font-bold text-2xl text-mc">Données personnelles</h3>
                  <p>
                    Nous comprenons l&apos;importance de protéger vos informations
                    personnelles et nous vous assurons que ce processus de validation est
                    strictement confidentiel.
                  </p>
                </div>
                <div className="modal-action block md:flex">
                  <button
                    className="btn btn-ghost w-full md:w-auto"
                    type="button"
                    onClick={() => {
                      setVisible(false)
                    }}
                  >
                    Annuler
                  </button>
                  <button className={'btn btn-primary'} type="submit">
                    <span
                      className={`${isSubmitLoading ? 'loading loading-spinner' : ''}`}
                    />
                    {initialValues ? 'Sauvegarder' : 'Déposer la candidature'}
                  </button>
                </div>
              </Modal>
            </form>
          </FormProvider>
        </div>
      </div>
      <div className="flex">
        <input
          type="checkbox"
          id="drawer-toggle"
          className="relative sr-only peer"
          checked={checked}
          onChange={() => setChecked((prev) => !prev)}
        />

        <div className="fixed hidden overflow-scroll md:block top-0 left-0 z-20 w-9/12 h-full transition-all duration-500 transform -translate-x-full bg-white shadow-lg peer-checked:translate-x-0">
          <div className="px-6 py-4">
            <h2 className="text-lg font-semibold">Prévisualition</h2>
            {candidature && (
              <CVDetails
                candidature={{
                  ...candidature,
                  competenceByType: getCompetencesByType(candidature.competences || []),
                }}
                size="full"
                showButton={false}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Candidature
