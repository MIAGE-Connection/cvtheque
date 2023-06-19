import { AddCandidatureInput } from 'components/Candidature'
import { UseFormRegister, useFormContext } from 'react-hook-form'

type ProfileFieldsProps = {
  register: UseFormRegister<AddCandidatureInput>
}
export const ProfileFields: React.FC<ProfileFieldsProps> = ({ register }) => {
  const {
    formState: { errors },
  } = useFormContext<AddCandidatureInput>()

  return (
    <div id="profile" className="space-y-4">
      <h1 className="sm:text-xl text-center font-semibold text-mc">Profil</h1>
      <div className="table mx-auto my-0 w-11/12 sm:w-4/6 border rounded-xl p-4">
        <div className="sm:flex sm:space-x-16 justify-center">
          <div className="form-control w-full md:max-w-xs">
            <label className="label">
              <span className="label-text">Prénom</span>
            </label>
            <input
              className="input input-bordered w-full md:max-w-xs"
              placeholder="..."
              type="text"
              {...register('firstName')}
              key="firstName"
            />
            <label className="label">
              <span className="label-text-alt text-mc">{errors.firstName?.message}</span>
            </label>
          </div>
          <div className="form-control w-full md:max-w-xs">
            <label className="label">
              <span className="label-text">Nom</span>
            </label>
            <input
              {...register('lastName')}
              placeholder="..."
              className="input input-bordered w-full md:max-w-xs"
              type="text"
            />
            <label className="label">
              <span className="label-text-alt text-mc">{errors.lastName?.message}</span>
            </label>
          </div>
        </div>
        <div className="sm:flex sm:space-x-16 justify-center">
          <div className="form-control w-full md:max-w-xs">
            <label className="label">
              <span className="label-text">Ville</span>
            </label>
            <input
              className="input input-bordered w-full md:max-w-xs"
              placeholder="Lille, Amiens..."
              type="text"
              {...register('city')}
            />
            <label className="label">
              <span className="label-text-alt text-mc">{errors.city?.message}</span>
            </label>
          </div>
          <div className="form-control w-full md:max-w-xs">
            <label className="label">
              <span className="label-text">Informations complémentaires</span>
            </label>
            <input
              {...register('info')}
              placeholder="Disponible dans toute la france..."
              className="input input-bordered w-full md:max-w-xs"
              type="text"
            />
          </div>
        </div>
        <div className="sm:flex sm:space-x-16 justify-center">
          <div className="form-control w-full sm:w-4/6">
            <label className="label">
              <span className="label-text">Type de contract recherché</span>
            </label>

            <select
              className="select select-bordered w-full"
              {...register('kind')}
              defaultValue={'CDI'}
            >
              <option value="ALTERNANCE">Alternance</option>
              <option value="CDI">CDI</option>
              <option value="STAGE">Stage</option>
            </select>
          </div>
        </div>
        <div className="sm:flex sm:space-x-16 justify-center">
          <div className="form-control w-full md:max-w-xs">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              className="input input-bordered w-full md:max-w-xs"
              placeholder="mail@mail.com"
              type="text"
              {...register('email')}
            />
            <label className="label">
              <span className="label-text-alt text-mc">{errors.email?.message}</span>
            </label>
          </div>
          <div className="form-control w-full md:max-w-xs">
            <label className="label">
              <span className="label-text">Téléphone</span>
            </label>
            <input
              className="input input-bordered w-full md:max-w-xs"
              placeholder="06 11 12 09 86"
              type="text"
              {...register('mobile')}
            />
          </div>
        </div>
        <div className="sm:flex sm:space-x-16 justify-center">
          <div className="form-control w-full sm:w-4/6">
            <label className="label">
              <span className="label-text">Télétravail</span>
            </label>
            <label className="cursor-pointer label">
              <span className="label-text text-lg">Je suis ouvert au télétravail</span>
              <input
                {...register('remote')}
                placeholder="Disponible dans toute la france..."
                className="checkbox checkbox-primary"
                type="checkbox"
                defaultChecked={false}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
