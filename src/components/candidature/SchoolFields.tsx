import { useFieldArray, useWatch } from 'react-hook-form'
import { CommonFormProps } from './EnterpriseFields'
import { Input } from 'components/Input'
import { dateToInputDate } from 'utils'

export const SchoolFields: React.FC<CommonFormProps> = ({ control, register }) => {
  const {
    fields: schools,
    append: addSchool,
    remove: deleteSchool,
  } = useFieldArray({
    name: 'schools',
    control,
  })

  const schoolValues = useWatch({
    control,
    name: `schools`,
  })

  return (
    <div id="school" className="space-y-4 animate-fade-in-down">
      <h1 className="text-xl text-center font-semibold text-mc">Parcours scolaire</h1>
      {schools.map((_school, index) => {
        return (
          <div
            className="table mx-auto my-0 w-11/12 lg:w-4/6 border rounded-xl p-2"
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
              <Input
                label="Lieu d'étude"
                register={register as any}
                name={`schools.${index}.universityName`}
                type="text"
                key={`schools.${index}.universityName`}
                large={true}
              />
            </div>
            <div className="sm:flex sm:space-x-16 justify-center">
              <Input
                label="Intitulé de la formation"
                register={register as any}
                name={`schools.${index}.title`}
                type="text"
                key={`schools.${index}.title`}
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
                  min={schoolValues?.[index]?.startAt}
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
              startAt: dateToInputDate(new Date()) || '',
              endAt: null,
              universityName: '',
              title: '',
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
