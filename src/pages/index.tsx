import { signIn, useSession } from 'next-auth/react'
import { NextPageWithLayout } from './_app'
const IndexPage: NextPageWithLayout = () => {
  // prefetch all posts for instant navigation
  // useEffect(() => {
  //   const allPosts = postsQuery.data?.pages.flatMap((page) => page.items) ?? [];
  //   for (const { id } of allPosts) {
  //     void utils.post.byId.prefetch({ id });
  //   }
  // }, [postsQuery.data, utils]);
  const { data: session } = useSession()

  const isLoggedIn = !!session?.user

  return (
    <>
      <div className="p-2" id="content">
        <h1 className="font-semibold text-4xl">
          Enregistrez vos Whiskys favoris et découvrez les prochains
        </h1>
      </div>
      {!isLoggedIn ? (
        <div className="card bg-base-200 shadow-xl m-2">
          <div className="card-body items-center text-center">
            <h2 className="card-title">Connectez-vous</h2>
            <p>Enregistrer, notez et jugez vos whiskys préférés!</p>
            <div className="card-actions">
              <button
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault()
                  signIn()
                }}
              >
                S&apos;inscrire ou se connecter
              </button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
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
