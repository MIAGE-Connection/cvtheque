import Link from 'next/link'
import { NextPageWithLayout } from './_app'
import { signIn, signOut } from 'next-auth/react'
const IndexPage: NextPageWithLayout = () => {
  // prefetch all posts for instant navigation
  // useEffect(() => {
  //   const allPosts = postsQuery.data?.pages.flatMap((page) => page.items) ?? [];
  //   for (const { id } of allPosts) {
  //     void utils.post.byId.prefetch({ id });
  //   }
  // }, [postsQuery.data, utils]);

  return (
    <>
      <div className="p-2" id="content">
        <h1 className="font-semibold text-4xl">CVTHEQUE</h1>
        <button className="btn btn-primary">
          <Link href="cv">Déposer un CV</Link>
        </button>
        <button className="btn btn-primary">
          <Link href="list">Liste des CV</Link>
        </button>
        <div>
          <button onClick={() => signIn()}>LOGIN </button>

          <button onClick={() => signOut()}>logout</button>
        </div>
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
