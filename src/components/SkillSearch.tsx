import { Control, useController } from 'react-hook-form'
import { AddCandidatureInput } from './utils'
import Select from 'react-select'
import { CompetenceType } from '@prisma/client'
import { useMemo } from 'react'
import { getSelectValue } from 'utils'

interface InputProps {
  control: Control<AddCandidatureInput>
}

export const SkillSearch: React.FC<InputProps> = ({ control }) => {
  const {
    field: { value: langValue, onChange: langOnChange, ...restLangField },
  } = useController({ name: `competences.${0}.type`, control })

  const competencesList = useMemo(
    () =>
      Object.values(CompetenceType).map((competence) => ({
        value: competence,
        label: getSelectValue(competence),
      })),
    [langValue],
  )

  return (
    <Select
      className="select-input"
      placeholder="Choix compétence"
      isClearable
      options={competencesList}
      value={langValue ? competencesList.find((x) => x.value === langValue) : langValue}
      onChange={(option) => langOnChange(option?.value ?? CompetenceType.REACT)}
      {...restLangField}
    />
  )
}
