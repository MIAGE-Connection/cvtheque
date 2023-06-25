import { Control, UseFormRegister, useFieldArray } from 'react-hook-form'
import { MissionsFields } from './MissionsFields'
import { Input } from 'components/Input'
import { dateToInputDate } from 'utils/utils'
import { AddCandidatureInput } from 'components/utils'

export type CommonFormProps = {
  register: UseFormRegister<AddCandidatureInput>
  control: Control<AddCandidatureInput>
}

export const EntrepriseFields: React.FC<CommonFormProps> = ({ control, register }) => {
  const {
    fields: experiences,
    remove,
    append,
  } = useFieldArray({
    control,
    name: `experiences`,
  })

  return (
    <>
      <div id="experiences" className="space-y-4">
        <h1 className="text-xl text-center font-semibold text-mc">Expériences</h1>
        {experiences.map((_experience, index) => {
          return (
            <div
              className="table mx-auto my-0 w-11/12 lg:w-4/6 border rounded-xl p-4"
              key={index}
            >
              {index !== 0 && (
                <div className="absolute right-2">
                  <button
                    className="btn btn-sm btn-circle btn-outline btn-primary"
                    onClick={(e) => {
                      e.preventDefault()
                      remove(index)
                    }}
                  >
                    X
                  </button>
                </div>
              )}
              <div className="sm:flex justify-center">
                <Input
                  label="Entreprise"
                  register={register as any}
                  name={`experiences.${index}.companyName`}
                  type="text"
                  placeholder="Google, Apple, ..."
                  key={`experiences.${index}.companyName`}
                  large={true}
                />
              </div>

              <div className="sm:flex sm:space-x-16 justify-center">
                <div className="form-control w-full md:max-w-xs">
                  <label className="label">
                    <span className="label-text">Date de début</span>
                  </label>
                  <input
                    className="input input-bordered w-full md:max-w-xs"
                    type="date"
                    required
                    {...register(`experiences.${index}.startAt`)}
                  />
                </div>

                <div className="form-control w-full md:max-w-xs">
                  <label className="label">
                    <span className="label-text">Date de fin</span>
                  </label>
                  <input
                    className="input input-bordered w-full md:max-w-xs"
                    type="date"
                    {...register(`experiences.${index}.endAt`)}
                  />
                </div>
              </div>
              <MissionsFields {...{ control, register, index }} field="experiences" />
            </div>
          )
        })}
        <div className="flex justify-center mt-2">
          <button
            className="btn btn-outline btn-primary"
            onClick={() => {
              append({
                companyName: '',
                missions: [{ mission: '' }],
                startAt: dateToInputDate(new Date()) || new Date(),
                endAt: null,
              })
            }}
            type="button"
          >
            Ajouter une éxperience
          </button>
        </div>
      </div>
    </>
  )
}
