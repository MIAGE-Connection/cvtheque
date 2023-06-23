import Image from 'next/image'
import mc from '../../../public/mc.png'
import Link from 'next/link'

export default function VerifyRequest() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex-col">
        <h1 className="font-bold text-3xl">Un email vous a été envoyé!</h1>
        <p className="text-center">Merci de votre confiance</p>
        <p className="text-center">
          L&apos;équipe <strong className="text-mc">Miage connection</strong>
        </p>
        <Link href="/" className="btn btn-link btn-xs p-0 mt-2">
          Retour à l&apos;accueil
        </Link>

        <div className="flex justify-center">
          <Image
            src={mc}
            className={'max-w-xs'}
            alt="Logo de Miage Connection"
            loading="eager"
            placeholder="blur"
          />
        </div>
      </div>
    </div>
  )
}
