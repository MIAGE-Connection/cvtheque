import { signIn, useSession } from 'next-auth/react'
import heroImg from '../../public/hero.svg'
import hiringImg from '../../public/hiring.svg'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export const Hero = () => {
  const { data: session } = useSession()
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2

      // Adjust the rotation to the mouse position
      const offsetX = (clientX - centerX) / 20
      const offsetY = (clientY - centerY) / 20
      setRotation({ x: offsetY, y: -offsetX })
    }

    document.body.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.body.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <>
      <div className="flex flex-wrap ">
        <div className="flex items-center w-full lg:w-1/2">
          <div className="max-w-2xl mb-8 ">
            <h1 className="text-4xl font-bold leading-snug tracking-tight text-gray-800 lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight">
              Bienvenue sur la CV-Thèque de MIAGE Connection
            </h1>
            <p className="py-5 text-xl leading-normal text-gray-500 lg:text-xl xl:text-2xl ">
              Vous êtes à la recherche d&apos;un stage ou d&apos;un emploi ? Vous êtes au
              bon endroit !
            </p>

            {!session && (
              <div className="flex items-center sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row">
                <button
                  className="btn btn-primary px-8 py-4 hover:scale-105"
                  onClick={() => signIn()}
                >
                  Inscrivez-vous
                </button>
                <button
                  className="btn btn-link px-8 py-4 hover:opacity-75"
                  onClick={() => signIn()}
                >
                  Se connecter
                </button>
              </div>
            )}
          </div>
        </div>
        <div
          className="flex items-center justify-center w-full lg:w-1/2"
          style={{ perspective: '1000px' }}
        >
          <div
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            }}
          >
            <Image
              src={heroImg}
              alt="Hero Illustration"
              className={'object-cover'}
              loading="eager"
            />
          </div>
        </div>
      </div>
      <div className="divider" />
      <div className="flex-col space-y-4 md:flex md:flex-row md:items-center md:justify-between">
        <div className="space-y-4">
          <h2 className="font-bold text-xl text-mc">
            Trouvez votre opportunité professionnelle idéale:
          </h2>
          <p>
            Déposez votre CV MIAGE dès aujourd'hui et connectez-vous avec les meilleures
            entreprises.
          </p>
          <h2 className="font-bold text-xl text-mc">
            Participer au réseau MIAGE Connection:
          </h2>
          <p>
            Rejoignez la communauté MIAGE Connection et profitez d&apos;un accès exclusif
            à des opportunités de carrière, provenant de nos partenaires.
          </p>
          <h2 className="font-bold text-xl text-mc">
            Déposez votre CV en quelques étapes:
          </h2>
          <p>
            Déposez votre CV en quelques étapes et après validation, il sera disponible!
          </p>
        </div>
        <div className="flex justify-center">
          <Image
            src={hiringImg}
            alt="Illustration de recrutement"
            className="w-48 md:w-96"
          />
        </div>
      </div>
    </>
  )
}
