import Image from 'next/image'
import mc from '../../../public/mc.png'
import Link from 'next/link'

export default function VerifyRequest() {
  return (
    <div className="flex relative justify-center items-center top-1/2 ">
      <div>
        <h1 className="font-bold text-3xl">Un email vous a été envoyé!</h1>
        <p>Merci de votre confiance</p>
        <p>
          L&apos;équipe <strong className="text-mc">Miage connection</strong>
        </p>
        <Link href="/" className="btn btn-link btn-xs p-0 mt-2">
          Retour à l&apos;accueil
        </Link>
      </div>

      <Image
        src={mc}
        className={'max-w-xs'}
        alt="Logo de Miage Connection"
        loading="eager"
        placeholder="blur"
      />
    </div>
  )
}
