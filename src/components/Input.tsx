import { useFormContext } from 'react-hook-form'

export const Input = (props: {
  label: string
  name: string
  type?: 'date'
  placeholder?: string
  //register: UseFormRegister<any>
  error?: string
}) => {
  const { label, name, type, placeholder, error } = props
  const { register } = useFormContext() // retrieve all hook methods

  const DateInput = () => (
    <>
      <div className="form-control w-full md:max-w-xs">
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
        <input
          id={name}
          type={type}
          className="input input-bordered w-full md:max-w-xs"
          required
          placeholder={placeholder}
          {...register(name)}
        />
      </div>
    </>
  )

  return <DateInput />
}
