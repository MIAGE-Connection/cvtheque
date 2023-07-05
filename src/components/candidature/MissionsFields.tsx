import { AddCandidatureInput } from 'components/utils'
import { Control, UseFormRegister, useFieldArray } from 'react-hook-form'

type EnterprisFieldsProps = {
  index: number
  register: UseFormRegister<AddCandidatureInput>
  control: Control<AddCandidatureInput>
  field: 'experiences' | 'experiencesAsso'
}

export const MissionsFields: React.FC<EnterprisFieldsProps> = ({
  control,
  index,
  register,
  field,
}) => {
  const {
    fields: missions,
    append: addMission,
    remove: removeMission,
  } = useFieldArray({
    control,
    name: `${field}.${index}.missions`,
  })
  return (
    <div className="flex justify-center animate-fade-in-down">
      <div className="w-full md:w-4/6">
        <label className="label">
          <span className="label-text font-semibold text-lg">Missions</span>
        </label>
        <div className="space-y-4">
          {missions.map((mission, indexMission) => {
            return (
              <div
                key={mission.id}
                className="flex justify-between items-center space-x-4"
              >
                <input
                  className="input input-bordered w-full"
                  type="text"
                  {...register(`${field}.${index}.missions.${indexMission}.mission`)}
                />
                <button
                  className="btn btn-sm btn-circle btn-outline btn-primary"
                  onClick={(e) => {
                    e.preventDefault()
                    removeMission(indexMission)
                  }}
                >
                  X
                </button>
              </div>
            )
          })}
          <button
            className="btn btn-sm btn-primary text-opacity-100 flex m-auto"
            onClick={(e) => {
              e.preventDefault()
              addMission({ mission: '' })
            }}
            type="button"
          >
            Ajouter une mission
          </button>
        </div>
      </div>
    </div>
  )
}
