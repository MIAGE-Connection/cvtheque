import { signIn } from 'next-auth/react'
import { useState } from 'react'
import mc from '../../../public/mc.png'
import Image from 'next/image'

export default function SignIn() {
  const [email, setMail] = useState('')
  return (
    <div className="flex relative justify-center items-center top-1/2">
      <div className="flex relative justify-center items-center top-1/2 ">
        <div className="form-control max-w-full space-y-2 w-[25rem]">
          <label className="label">
            <span className="label-text text-xl font-bold text-mc">Adresse email</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setMail(e.target.value)}
            className="input input-bordered w-full "
          />
          <p className="text-gray-500">
            Vous allez être notifié par e-mail afin de valider la connexion à votre
            compte.
          </p>
          <button
            className="btn btn-primary"
            type="submit"
            onClick={() => signIn('email', { email })}
          >
            Se connecter
          </button>
        </div>

        <Image
          src={mc}
          className={'max-w-xs'}
          alt="Logo de Miage Connection"
          loading="eager"
          placeholder="blur"
        />
      </div>
    </div>
  )
}
