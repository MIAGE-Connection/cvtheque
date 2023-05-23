import Navbar from 'components/Navbar'
import { NextPage } from 'next'
import type { Session } from 'next-auth'
import { getSession, SessionProvider } from 'next-auth/react'
import type { AppType } from 'next/app'
import { ReactElement, ReactNode } from 'react'
import { trpc } from 'utils/trpc'
import '../styles/global.css'

export type NextPageWithLayout<
  TProps = Record<string, unknown>,
  TInitialProps = TProps,
> = NextPage<TProps, TInitialProps> & {
  getLayout?: (page: ReactElement) => ReactNode
}

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps }) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Navbar>
        <Component {...pageProps} />
      </Navbar>
    </SessionProvider>
  )
}

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    session: await getSession(ctx),
  }
}

export default trpc.withTRPC(MyApp)
