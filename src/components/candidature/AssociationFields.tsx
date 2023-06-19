import { useFieldArray } from 'react-hook-form'
import { CommonFormProps } from './EnterpriseFields'
import { MissionsFields } from './MissionsFields'

export const AssociationFields: React.FC<CommonFormProps> = ({ control, register }) => {
  const {
    fields: associations,
    remove,
    append,
  } = useFieldArray({
    control,
    name: `experiencesAsso`,
  })

  return (
    <>
      <div id="associations" className="space-y-4">
        <h1 className="text-xl text-center font-semibold text-mc">Associations</h1>
        {associations.map((_association, index) => {
          return (
            <div
              className="table mx-auto my-0 w-11/12 sm:w-4/6 border rounded-xl p-4"
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
                <div className="form-control w-full sm:w-4/6">
                  <label className="label">
                    <span className="label-text">Association</span>
                  </label>
                  <input
                    className="input input-bordered w-full"
                    type="text"
                    {...register(`experiencesAsso.${index}.name`)}
                  />
                </div>
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
                missions: [{ mission: '' }],
                startAt: new Date(),
                endAt: new Date(),
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
