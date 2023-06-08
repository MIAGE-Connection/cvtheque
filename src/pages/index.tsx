import { Hero } from 'components/Hero'
import { StudentHomePage } from 'components/homepage/StudentHomePage'
import { useSession } from 'next-auth/react'
import { NextPageWithLayout } from './_app'

const IndexPage: NextPageWithLayout = () => {
  const { data: session } = useSession()

  const isStudent = session?.user?.role === 'USER' || session?.user?.role === 'REVIEWER'

  return (
    <>
      <div className="p-2 mt-12 md:mx-16" id="content">
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
