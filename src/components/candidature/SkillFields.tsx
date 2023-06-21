import { useFieldArray } from 'react-hook-form'
import { CommonFormProps } from './EnterpriseFields'
import { getSelectValue } from 'utils/utils'
import { CompetenceType } from '@prisma/client'

export const SkillFields: React.FC<CommonFormProps> = ({ control, register }) => {
  const {
    fields: competences,
    append: addCompetence,
    remove: deleteCompetence,
  } = useFieldArray({
    name: 'competences',
    control,
  })
  return (
    <div id="skills" className="space-y-4">
      <h1 className="text-xl text-center font-semibold text-mc">Compétences</h1>
      {competences.map((_competence, index) => {
        return (
          <div
            className="table mx-auto my-0 w-11/12 lg:w-4/6 border rounded-xl p-2"
            key={index}
          >
            {index !== 0 && (
              <div className="absolute right-2">
                <button
                  className="btn btn-sm btn-circle btn-outline btn-primary"
                  onClick={(e) => {
                    e.preventDefault()
                    deleteCompetence(index)
                  }}
                >
                  X
                </button>
              </div>
            )}
            <div className="sm:flex sm:space-x-16 justify-center">
              <div className="form-control w-full sm:w-4/6">
                <label className="label">
                  <span className="label-text">Type</span>
                </label>

                <select
                  className="select select-bordered w-full"
                  {...register(`competences.${index}.type`)}
                  defaultValue={CompetenceType.FRONTEND}
                >
                  {Object.keys(CompetenceType).map((key) => (
                    <option key={key} value={key}>
                      {getSelectValue(key as CompetenceType)}
                    </option>
                  ))}
                </select>
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
                  {...register(`competences.${index}.description`)}
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
            addCompetence({
              description: '',
              type: CompetenceType.PROJECT_MANAGEMENT,
            })
          }}
          type="button"
        >
          Ajouter une compétence
        </button>
      </div>
    </div>
  )
}
