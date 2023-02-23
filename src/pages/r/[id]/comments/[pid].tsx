import React, { useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'

import About from '../../../../components/Community/About'
import PageContentLayout from '../../../../components/Layout/PageContent'

import { auth, firestore } from '../../../../firebase/clientApp'
import useCommunityData from '@/hook/useCommunityData'
import usePosts from '@/hook/usePost'
import { Post } from '@/atoms/PostAtom'
import PostLoader from '@/components/Posts/PostForm/PostLoader'
import PostItem from '@/components/Posts/PostForm/PostItem'
import Comments from '@/components/Posts/Comments/Comments'

const PostPage = () => {
  const [user] = useAuthState(auth)
  const router = useRouter()
  const { id, pid } = router.query
  const { communityStateValue } = useCommunityData()

  // Need to pass community data here to see if current post [pid] has been voted on
  const {
    postStateValue,
    setPostStateValue,
    onDeletePost,
    loading,
    setLoading,
    onVote,
  } = usePosts(communityStateValue.currentCommunity)

  const fetchPost = async () => {
    setLoading(true)
    try {
      const postDocRef = doc(firestore, 'posts', pid as string)
      const postDoc = await getDoc(postDocRef)
      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: { id: postDoc.id, ...postDoc.data() } as Post,
      }))
    } catch (error: any) {
      console.error('fetchPost error', error.message)
    }
    setLoading(false)
  }

  // Fetch post if not in already in state
  useEffect(() => {
    const { pid } = router.query

    if (pid && !postStateValue.selectedPost) {
      fetchPost()
    }
  }, [router.query, postStateValue.selectedPost])

  return (
    <PageContentLayout>
      {/* Left Content */}
      <>
        {loading ? (
          <PostLoader />
        ) : (
          <>
            {postStateValue.selectedPost && (
              <>
                <PostItem
                  post={postStateValue.selectedPost}
                  onVote={onVote}
                  onDeletePost={onDeletePost}
                  userVoteValue={
                    postStateValue.postVotes.find(
                      (item) => item.postId === postStateValue.selectedPost!.id
                    )?.voteValue
                  }
                  userIsCreator={
                    user?.uid === postStateValue.selectedPost.creatorId
                  }
                  router={router}
                />
                <Comments
                  user={user}
                  communityId={id as string}
                  selectedPost={postStateValue.selectedPost}
                />
              </>
            )}
          </>
        )}
      </>
      {/* Right Content */}
      <>
        {communityStateValue.currentCommunity && (
          <About
            communityData={communityStateValue.currentCommunity}
            loading={loading}
          />
        )}
      </>
    </PageContentLayout>
  )
}
export default PostPage
