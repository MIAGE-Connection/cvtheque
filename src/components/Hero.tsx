import { signIn, useSession } from 'next-auth/react'
import heroImg from '../../public/hero.png'
import Image from 'next/image'

export const Hero = () => {
  const { data: session } = useSession()
  return (
    <>
      <div className="flex flex-wrap ">
        <div className="flex items-center w-full lg:w-1/2">
          <div className="max-w-2xl mb-8 ">
            <h1 className="text-4xl font-bold leading-snug tracking-tight text-gray-800 lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight">
              Bienvenue sur la CV-Thèque de Miage Connection
            </h1>
            <p className="py-5 text-xl leading-normal text-gray-500 lg:text-xl xl:text-2xl dark:text-gray-300">
              Vous êtes à la recherche d&apos;un stage ou d&apos;un emploi ? Vous êtes au
              bon endroit !
            </p>

            {!session && (
              <div className="flex flex-col items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row">
                <button className="btn btn-primary px-8 py-4" onClick={() => signIn()}>
                  Inscrivez-vous
                </button>
                <button className="btn btn-link px-8 py-4" onClick={() => signIn()}>
                  Se connecter
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center w-full lg:w-1/2">
          <div>
            <Image
              src={heroImg}
              className={'object-cover'}
              alt="Hero Illustration"
              loading="eager"
              placeholder="blur"
            />
          </div>
        </div>
      </div>
    </>
  )
}
