import { useFieldArray, useWatch } from 'react-hook-form'
import { CommonFormProps } from './EnterpriseFields'
import { MissionsFields } from './MissionsFields'
import { dateToInputDate } from 'utils'
import { Input } from 'components/Input'

export const AssociationFields: React.FC<CommonFormProps> = ({ control, register }) => {
  const {
    fields: associations,
    remove,
    append,
  } = useFieldArray({
    control,
    name: `experiencesAsso`,
  })

  const experiencesAssoValues = useWatch({
    control,
    name: `experiencesAsso`,
  })

  return (
    <>
      <div id="associations" className="space-y-4 animate-fade-in-down">
        <h1 className="text-xl text-center font-semibold text-mc">Associations</h1>
        {associations.map((_association, index) => {
          return (
            <div
              className="table mx-auto my-0 w-11/12 lg:w-4/6 border rounded-xl p-4"
              key={index}
            >
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
              <div className="sm:flex sm:space-x-16 justify-center">
                <Input
                  label="Association"
                  register={register as any}
                  name={`experiencesAsso.${index}.name`}
                  type="text"
                  placeholder="Asso locale, ..."
                  key={`experiencesAsso.${index}.name`}
                  large={true}
                />
              </div>
              <div className="sm:flex sm:space-x-16 justify-center">
                <Input
                  label="Intitulé du poste"
                  register={register as any}
                  name={`experiencesAsso.${index}.job`}
                  type="text"
                  placeholder="Responsable communication, ..."
                  key={`experiencesAsso.${index}.job`}
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
                    {...register(`experiencesAsso.${index}.startAt`)}
                  />
                </div>

                <div className="form-control w-full md:max-w-xs">
                  <label className="label">
                    <span className="label-text">Date de fin</span>
                  </label>
                  <input
                    className="input input-bordered w-full md:max-w-xs"
                    type="date"
                    min={experiencesAssoValues?.[index]?.startAt}
                    {...register(`experiencesAsso.${index}.endAt`)}
                  />
                </div>
              </div>
              <MissionsFields {...{ control, register, index }} field="experiencesAsso" />
            </div>
          )
        })}
        <div className="flex justify-center mt-2">
          <button
            className="btn btn-outline btn-primary"
            onClick={() => {
              append({
                name: '',
                job: '',
                missions: [{ mission: '' }],
                startAt: dateToInputDate(new Date()) || '',
                endAt: null,
              })
            }}
            type="button"
          >
            Ajouter une association
          </button>
        </div>
      </div>
    </>
  )
}
