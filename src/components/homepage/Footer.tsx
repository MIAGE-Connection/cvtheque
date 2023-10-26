import Image from 'next/image'
import mc from '../../../public/mc.png'
import Link from 'next/link'

export const Footer: React.FC = () => {
  return (
    <footer className="my-4">
      <div className="divider" />
      <div>
        <div className="flex justify-between items-center">
          <button className="btn btn-link normal-case">
            <Link
              href="https://www.miage-connection.fr/"
              target="_blank"
              className="flex space-x-4 items-center"
            >
              <Image src={mc} alt="logo miage connection" className="w-12 md:w-16" />
              <p>MIAGE Connection</p>
            </Link>
          </button>
          <div className="flex space-x-2">
            <Link
              href="https://www.linkedin.com/company/miageconnection/"
              target="_blank"
            >
              <svg
                className="w-6 h-6 text-gray-800"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 15 15"
              >
                <path
                  fillRule="evenodd"
                  d="M7.979 5v1.586a3.5 3.5 0 0 1 3.082-1.574C14.3 5.012 15 7.03 15 9.655V15h-3v-4.738c0-1.13-.229-2.584-1.995-2.584-1.713 0-2.005 1.23-2.005 2.5V15H5.009V5h2.97ZM3 2.487a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                  clipRule="evenodd"
                />
                <path d="M3 5.012H0V15h3V5.012Z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
