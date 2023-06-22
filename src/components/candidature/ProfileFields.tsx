import { AddCandidatureInput } from 'components/Candidature'
import { Input } from 'components/Input'
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
      <div className="table mx-auto my-0 w-11/12 lg:w-4/6 border rounded-xl p-4">
        <div className="sm:flex sm:space-x-16 justify-center">
          <Input
            label="Prénom"
            register={register as any}
            name="firstName"
            type="text"
            error={errors.firstName?.message}
            key={'firstName'}
          />
          <Input
            label="Nom"
            register={register as any}
            name="lastName"
            type="text"
            error={errors.lastName?.message}
            key={'lastName'}
          />
        </div>
        <div className="sm:flex sm:space-x-16 justify-center">
          <Input
            label="Ville"
            register={register as any}
            name="city"
            type="text"
            error={errors.city?.message}
            key={'city'}
          />
          <Input
            label="Informations complémentaires"
            register={register as any}
            name="info"
            type="text"
            placeholder="Disponible dans toute la france..."
            key={'info'}
          />
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
          <Input
            label="Email"
            register={register as any}
            name="email"
            type="email"
            error={errors.email?.message}
            placeholder="Disponible dans toute la france..."
            key={'email'}
          />

          <Input
            label="Téléphone"
            register={register as any}
            name="mobile"
            type="text"
            placeholder="06 12 34 56 78"
            key={'mobile'}
          />
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
