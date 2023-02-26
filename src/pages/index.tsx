import { Community } from '@/atoms/CommunitiesAtom'
import { Post, PostVote } from '@/atoms/PostAtom'
import CreatePostLink from '@/components/Community/CreatePostLink'
import PersonalHome from '@/components/Community/PersonalHome'
import Premium from '@/components/Community/Premium'
import Recommendations from '@/components/Community/Recommendations'
import PageContent from '@/components/Layout/PageContent'
import PostItem from '@/components/Posts/PostForm/PostItem'
import PostLoader from '@/components/Posts/PostForm/PostLoader'
import { auth, firestore } from '@/firebase/clientApp'
import useCommunityData from '@/hook/useCommunityData'
import usePosts from '@/hook/usePost'
import { Stack } from '@chakra-ui/react'
import {
  collection,
  DocumentData,
  endAt,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  startAt,
  where,
} from 'firebase/firestore'
import type { GetServerSidePropsContext, NextPage } from 'next'
import { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import safeJsonStringify from 'safe-json-stringify'
type Props = {
  postData: Post[]
  communitiesData: Community[]
}

const Home = function ({ postData, communitiesData }: Props) {
  const [user, loadingUser] = useAuthState(auth)
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
    loading,
    setLoading,
  } = usePosts()
  const { communityStateValue } = useCommunityData()

  const getUserHomePosts = async () => {
    setLoading(true)
    try {
      /**
       * if snippets has no length (i.e. user not in any communities yet)
       * do query for 20 posts ordered by voteStatus
       */
      const feedPosts: Post[] = []

      // User has joined communities
      if (communityStateValue.mySnippets.length) {
        const myCommunityIds = communityStateValue.mySnippets.map(
          (snippet) => snippet.communityId
        )
        // Getting 2 posts from 3 communities that user has joined
        let postPromises: Array<Promise<QuerySnapshot<DocumentData>>> = []
        ;[0, 1, 2].forEach((index) => {
          if (!myCommunityIds[index]) return

          postPromises.push(
            getDocs(
              query(
                collection(firestore, 'posts'),
                where('communityId', '==', myCommunityIds[index]),
                limit(10)
              )
            )
          )
        })
        const queryResults = await Promise.all(postPromises)
        /**
         * queryResults is an array of length 3, each with 0-2 posts from
         * 3 communities that the user has joined
         */
        queryResults.forEach((result) => {
          const posts = result.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Post[]
          feedPosts.push(...posts)
        })
      }
      // User has not joined any communities yet
      else {
        const postQuery = query(
          collection(firestore, 'posts'),
          orderBy('voteStatus', 'desc'),
          limit(10)
        )
        const postDocs = await getDocs(postQuery)
        const posts = postDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[]
        feedPosts.push(...posts)
      }

      setPostStateValue((prev) => ({
        ...prev,
        posts: feedPosts,
      }))

      // if not in any, get 5 communities ordered by number of members
      // for each one, get 2 posts ordered by voteStatus and set these to postState posts
    } catch (error: any) {
      console.error('getUserHomePosts error', error.message)
    }
    setLoading(false)
  }

  const getNoUserHomePosts = async () => {
    setPostStateValue((prev) => ({
      ...prev,
      posts: postData as Post[],
    }))
  }

  const getUserPostVotes = async () => {
    const postIds = postStateValue.posts.map((post) => post.id)
    const postVotesQuery = query(
      collection(firestore, `users/${user?.uid}/postVotes`),
      where('postId', 'in', postIds)
    )
    const unsubscribe = onSnapshot(postVotesQuery, (querySnapshot) => {
      const postVotes = querySnapshot.docs.map((postVote) => ({
        id: postVote.id,
        ...postVote.data(),
      }))

      setPostStateValue((prev) => ({
        ...prev,
        postVotes: postVotes as PostVote[],
      }))
    })

    return () => unsubscribe()
  }

  useEffect(() => {
    if (communityStateValue.snippetsFetched) {
      getUserHomePosts()
    }
  }, [communityStateValue.snippetsFetched])

  useEffect(() => {
    if (!user && !loadingUser) {
      getNoUserHomePosts()
    }
  }, [user, loadingUser])

  useEffect(() => {
    if (!user || !postStateValue.posts.length) return
    getUserPostVotes()

    // Clear postVotes on dismount
    return () => {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }))
    }
  }, [postStateValue.posts, user])

  return (
    <PageContent>
      <>
        {/* <CreatePostLink /> */}
        {loading ? (
          <PostLoader />
        ) : (
          <Stack>
            {postStateValue.posts.map((post: Post, index) => (
              <PostItem
                key={post.id}
                post={post}
                postIdx={index}
                onVote={onVote}
                onDeletePost={onDeletePost}
                userVoteValue={
                  postStateValue.postVotes.find(
                    (item) => item.postId === post.id
                  )?.voteValue
                }
                userIsCreator={user?.uid === post.creatorId}
                onSelectPost={onSelectPost}
                homePage
              />
            ))}
          </Stack>
        )}
      </>
      <Stack spacing={5} position='sticky' top='14px'>
        <Recommendations communitiesData={communitiesData} />
        <Premium />
        <PersonalHome />
      </Stack>
    </PageContent>
  )
}

export default Home

export async function getServerSideProps() {
  //get top communities
  try {
    const communityQuery = query(
      collection(firestore, 'communities'),
      orderBy('numberOfMembers', 'desc'),
      limit(5)
    )
    const communityDocs = await getDocs(communityQuery)
    const communities = communityDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Community[]
    //get home post
    const postQuery = query(
      collection(firestore, 'posts'),
      orderBy('voteStatus', 'desc'),
      limit(10)
    )

    const postDocs = await getDocs(postQuery)
    const posts = postDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return {
      props: {
        postData: JSON.parse(safeJsonStringify(posts)), // needed for dates
        communitiesData: JSON.parse(safeJsonStringify(communities)), // needed for dates
      },
    }
  } catch (error) {
    // Could create error page here
    return { props: { postData: '', communitiesData: '' } }
  }
}
