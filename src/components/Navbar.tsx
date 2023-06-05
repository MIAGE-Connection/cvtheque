import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { ReactElement } from 'react'

const Navbar: React.FC<{ children: ReactElement }> = ({ children }) => {
  const { data } = useSession()
  const isLoggedIn = !!data?.user?.email

  const routeItems = (
    <>
      <li>
        <Link href="/">
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
      {isLoggedIn && (
        <li>
          <Link href="profile">
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
            Mon compte
          </Link>
        </li>
      )}
      <li>
        <Link href="infos">
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
    </>
  )
  return (
    <>
      <div className="drawer">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content flex flex-col">
          <div className="w-full navbar bg-base-300">
            <div className="flex-none lg:hidden">
              <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-6 h-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <div className="flex-1 px-2 mx-2 font-bold">CVTHEQUE</div>
            <div className="flex-none hidden lg:block">
              <ul className="menu menu-horizontal">
                {routeItems}
                <li>
                  <a onClick={() => signOut()}>
                    <svg
                      fill="#000000"
                      className="h-5 w-5 fill-red-800"
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
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {children}
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
          <div className="w-2/3">
            <ul className="menu bg-base-100 h-5/6 m-0">
              <p className="m-4 menu-title">Menu</p>
              {routeItems}
            </ul>
            <ul className="menu bg-base-100 h-1/6 justify-end text-red-800">
              <li>
                <a onClick={() => signOut()}>
                  <svg
                    fill="#000000"
                    className="h-5 w-5 fill-red-800"
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
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
export default Navbar
