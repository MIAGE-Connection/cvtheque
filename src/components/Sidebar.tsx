import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { ReactElement, useState } from 'react'
import { trpc } from 'utils/trpc'
import { isUserPartner, isUserReviewer } from 'utils/utils'

const Sidebar: React.FC<{ children: ReactElement }> = ({ children }) => {
  const { data } = useSession()
  const isLoggedIn = !!data?.user?.email
  const isPartner = isUserPartner(data?.user.role)
  const isReviewer = isUserReviewer(data?.user.role)
  const { data: candidature } = trpc.candidature.findByEmail.useQuery(undefined, {
    staleTime: Infinity,
  })

  const isAdmin = data?.user?.role === 'ADMIN'
  const [visible, setVisible] = useState<boolean>(false)

  const routeItems = (
    <>
      <li>
        <Link href="/" onClick={() => setVisible(false)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Accueil
        </Link>
      </li>
      {isReviewer && (
        <li>
          <Link href="/reviews">
            <svg
              className="h-5 w-5 stroke-green-600"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.688 5.69833C20.3342 6.28473 20.6573 6.57793 20.8287 6.96478C21 7.35163 21 7.78795 21 8.66058L21 13C21 14.8856 21 15.8284 20.4142 16.4142C19.8284 17 18.8856 17 17 17H13C11.1144 17 10.1716 17 9.58579 16.4142C9 15.8284 9 14.8856 9 13L9 7C9 5.11438 9 4.17157 9.58579 3.58579C10.1716 3 11.1144 3 13 3H15.17C15.9332 3 16.3148 3 16.6625 3.13422C17.0101 3.26845 17.2927 3.52488 17.8579 4.03776L19.688 5.69833Z"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M9 7L7 7C5.11438 7 4.17157 7 3.58579 7.58579C3 8.17157 3 9.11438 3 11L3 17C3 18.8856 3 19.8284 3.58579 20.4142C4.17157 21 5.11438 21 7 21H11C12.8856 21 13.8284 21 14.4142 20.4142C15 19.8284 15 18.8856 15 17V17"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            Candidatures à corriger
          </Link>
        </li>
      )}
      {isReviewer && (
        <li>
          <Link href="/stats">
            <svg
              className="h-5 w-5 stroke-green-600"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.688 5.69833C20.3342 6.28473 20.6573 6.57793 20.8287 6.96478C21 7.35163 21 7.78795 21 8.66058L21 13C21 14.8856 21 15.8284 20.4142 16.4142C19.8284 17 18.8856 17 17 17H13C11.1144 17 10.1716 17 9.58579 16.4142C9 15.8284 9 14.8856 9 13L9 7C9 5.11438 9 4.17157 9.58579 3.58579C10.1716 3 11.1144 3 13 3H15.17C15.9332 3 16.3148 3 16.6625 3.13422C17.0101 3.26845 17.2927 3.52488 17.8579 4.03776L19.688 5.69833Z"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M9 7L7 7C5.11438 7 4.17157 7 3.58579 7.58579C3 8.17157 3 9.11438 3 11L3 17C3 18.8856 3 19.8284 3.58579 20.4142C4.17157 21 5.11438 21 7 21H11C12.8856 21 13.8284 21 14.4142 20.4142C15 19.8284 15 18.8856 15 17V17"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            Statistique
          </Link>
        </li>
      )}
      {isPartner && (
        <li>
          <Link href="/list">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
            >
              <path
                d="M19.688 5.69833C20.3342 6.28473 20.6573 6.57793 20.8287 6.96478C21 7.35163 21 7.78795 21 8.66058L21 13C21 14.8856 21 15.8284 20.4142 16.4142C19.8284 17 18.8856 17 17 17H13C11.1144 17 10.1716 17 9.58579 16.4142C9 15.8284 9 14.8856 9 13L9 7C9 5.11438 9 4.17157 9.58579 3.58579C10.1716 3 11.1144 3 13 3H15.17C15.9332 3 16.3148 3 16.6625 3.13422C17.0101 3.26845 17.2927 3.52488 17.8579 4.03776L19.688 5.69833Z"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M9 7L7 7C5.11438 7 4.17157 7 3.58579 7.58579C3 8.17157 3 9.11438 3 11L3 17C3 18.8856 3 19.8284 3.58579 20.4142C4.17157 21 5.11438 21 7 21H11C12.8856 21 13.8284 21 14.4142 20.4142C15 19.8284 15 18.8856 15 17V17"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            Liste
          </Link>
        </li>
      )}
      {isAdmin && (
        <li>
          <Link href="/users">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Liste des utilisateurs
          </Link>
        </li>
      )}
      {isLoggedIn && candidature && (
        <li>
          <Link href={`/list/${candidature.candidatureId}`}>
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
            >
              <g id="User / User_01">
                <path
                  id="Vector"
                  d="M19 21C19 17.134 15.866 14 12 14C8.13401 14 5 17.134 5 21M12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7C16 9.20914 14.2091 11 12 11Z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
            Mon CV
          </Link>
        </li>
      )}
      <li>
        <Link href="/infos">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Infos
        </Link>
      </li>

      {isLoggedIn && (
        <li className="mt-auto">
          <a
            onClick={() => {
              signOut()
              setVisible(false)
            }}
            className="text-error"
          >
            <svg
              fill="#000000"
              className="h-5 w-5 fill-error"
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M106.667 512c0-200.295 162.371-362.667 362.667-362.667 57.937 0 112.644 13.57 161.173 37.687 10.551 5.243 23.356.941 28.599-9.61 5.239-10.551.939-23.355-9.613-28.599-54.293-26.982-115.486-42.144-180.16-42.144C245.473 106.667 64 288.141 64 512s181.474 405.333 405.333 405.333c64.674 0 125.867-15.164 180.16-42.146 10.551-5.244 14.852-18.044 9.613-28.595-5.244-10.551-18.048-14.857-28.599-9.613-48.529 24.115-103.236 37.687-161.173 37.687-200.295 0-362.667-162.372-362.667-362.667z" />
              <path d="M783.087 326.249c-8.333-8.332-21.841-8.332-30.174 0-8.329 8.331-8.329 21.839 0 30.17l134.251 134.249h-353.83c-11.78 0-21.333 9.553-21.333 21.333s9.553 21.333 21.333 21.333h353.83L752.913 667.58c-8.329 8.333-8.329 21.841 0 30.174 8.333 8.329 21.841 8.329 30.174 0l170.667-170.667a21.29 21.29 0 004.655-6.985A21.31 21.31 0 00960 512a21.252 21.252 0 00-5.79-14.613l-.512-.525-170.611-170.613z" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Se déconnecter
          </a>
        </li>
      )}
    </>
  )

  return (
    <>
      <div className="drawer">
        <input
          id="my-drawer-2"
          type="checkbox"
          className="drawer-toggle"
          checked={visible}
          onChange={() => setVisible((prev) => !prev)}
        />
        <div className="drawer-content flex flex-col">
          <div className="mt-16 mx-2 md:mx-16">{children}</div>
          <label htmlFor="my-drawer-2" className="absolute top-2 left-2 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 50 50"
              width="50px"
              height="50px"
              className="fill-mc"
            >
              <path d="M 0 9 L 0 11 L 50 11 L 50 9 Z M 0 24 L 0 26 L 50 26 L 50 24 Z M 0 39 L 0 41 L 50 41 L 50 39 Z" />
            </svg>
          </label>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 bg-gray-100 h-full text-xl">
            <p className="m-4 font-semibold text-mc text-2xl">Menu</p>
            {routeItems}
          </ul>
        </div>
      </div>
    </>
  )
}
export default Sidebar
