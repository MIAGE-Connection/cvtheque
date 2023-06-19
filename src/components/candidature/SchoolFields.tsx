import { useFieldArray } from 'react-hook-form'
import { CommonFormProps } from './EnterpriseFields'

export const SchoolFields: React.FC<CommonFormProps> = ({ control, register }) => {
  const {
    fields: schools,
    append: addSchool,
    remove: deleteSchool,
  } = useFieldArray({
    name: 'schools',
    control,
  })
  return (
    <div id="school" className="space-y-4">
      <h1 className="text-xl text-center font-semibold text-mc">Parcours scolaire</h1>
      {schools.map((_school, index) => {
        return (
          <div
            className="table mx-auto my-0 w-11/12 sm:w-4/6 border rounded-xl p-2"
            key={index}
          >
            {index !== 0 && (
              <div className="absolute right-2">
                <button
                  className="btn btn-sm btn-circle btn-primary btn-outline"
                  onClick={(e) => {
                    e.preventDefault()
                    deleteSchool(index)
                  }}
                >
                  X
                </button>
              </div>
            )}
            <div className="sm:flex sm:space-x-16 justify-center">
              <div className="form-control w-full sm:w-4/6">
                <label className="label">
                  <span className="label-text">Lieu d&apos;étude</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  type="text"
                  {...register(`schools.${index}.universityName`)}
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
                  {...register(`schools.${index}.startAt`)}
                />
              </div>
              <div className="form-control w-full md:max-w-xs">
                <label className="label">
                  <span className="label-text">Date de fin</span>
                </label>
                <input
                  className="input input-bordered w-full md:max-w-xs"
                  type="date"
                  {...register(`schools.${index}.endAt`)}
                />
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-full md:w-4/6">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  className="textarea h-24 textarea-bordered w-full"
                  placeholder="Description"
                  {...register(`schools.${index}.description`)}
                />
              </div>
            </div>
          </div>
        )
      })}
      <div className="flex justify-center mt-2">
        <button
          className="btn btn-outline btn-primary"
          onClick={() => {
            addSchool({
              description: '',
              startAt: new Date(),
              endAt: new Date(),
              universityName: '',
            })
          }}
          type="button"
        >
          Ajouter un parcours scolaire
        </button>
      </div>
    </div>
  )
}
