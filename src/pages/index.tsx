import { Hero } from 'components/Hero'
import { NextPageWithLayout } from './_app'
import { StudentHomePage } from 'components/homepage/StudentHomePage'
import { signOut, useSession } from 'next-auth/react'

const IndexPage: NextPageWithLayout = () => {
  const { data: session } = useSession()

  const isStudent = session?.user?.role === 'USER'

  return (
    <>
      {session && (
        <div className="relative">
          <button
            className="btn btn-warning absolute right-4 top-12"
            onClick={() => signOut()}
          >
            Se déconnecter
          </button>
        </div>
      )}
      <div className="p-2 mt-12 mx-16" id="content">
        <Hero />
        <div className="divider" />
        {isStudent && <StudentHomePage />}
      </div>
    </>
  )
}

export default IndexPage

/**
 * If you want to statically render this page
 * - Export `appRouter` & `createContext` from [trpc].ts
 * - Make the `opts` object optional on `createContext()`
 *
 * @link https://trpc.io/docs/ssg
 */
// export const getStaticProps = async (
//   context: GetStaticPropsContext<{ filter: string }>,
// ) => {
//   const ssg = createProxySSGHelpers({
//     router: appRouter,
//     ctx: await createContext(),
//   });
//
//   await ssg.post.all.fetch();
//
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       filter: context.params?.filter ?? 'all',
//     },
//     revalidate: 1,
//   };
// };
