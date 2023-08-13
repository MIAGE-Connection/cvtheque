import { NextPage } from 'next'
import type { Session } from 'next-auth'
import { SessionProvider, getSession } from 'next-auth/react'
import type { AppType } from 'next/app'
import Head from 'next/head'
import { ReactElement, ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { trpc } from 'utils/trpc'
import '../styles/global.css'
import SideMenu from 'components/SideMenu'

export type NextPageWithLayout<
  TProps = Record<string, unknown>,
  TInitialProps = TProps,
> = NextPage<TProps, TInitialProps> & {
  getLayout?: (page: ReactElement) => ReactNode
}

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps }) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>CV-Thèque MC</title>
      </Head>
      <SideMenu />
      <div className="mx-2 md:mx-16">
        <Component {...pageProps} />
      </div>
      <ToastContainer autoClose={3000} />
    </SessionProvider>
  )
}

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    session: await getSession(ctx),
  }
}

export default trpc.withTRPC(MyApp)
