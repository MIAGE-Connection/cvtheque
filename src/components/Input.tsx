import { InputHTMLAttributes } from 'react'
import { FieldValues, UseFormRegister } from 'react-hook-form'
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  register: UseFormRegister<FieldValues> // declare register props
  type: 'text' | 'date' | 'email'
  placeholder?: string
  name: string
  error?: string
  large?: boolean
}
export const Input: React.FC<InputProps> = ({
  type,
  label,
  register,
  placeholder,
  error,
  name,
  large,
  ...rest
}) => {
  const TextInput = () => (
    <>
      <div className={`form-control w-full ${large ? 'sm:w-4/6' : 'md:max-w-xs'}`}>
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
        <input
          type={type}
          className="input input-bordered w-full"
          placeholder={placeholder}
          id={name}
          {...register(name)}
          {...rest}
        />
        {error && (
          <label className="label">
            <span className="label-text-alt text-mc">{error}</span>
          </label>
        )}
      </div>
    </>
  )

  return TextInput()
}
