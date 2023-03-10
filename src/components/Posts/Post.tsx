import React, { useEffect, useState } from 'react'
import { Stack } from '@chakra-ui/react'
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
  writeBatch,
} from 'firebase/firestore'
import { useRecoilState, useSetRecoilState } from 'recoil'

import { firestore } from '../../firebase/clientApp'

import { useRouter } from 'next/router'
import { Community } from '@/atoms/CommunitiesAtom'
import { Post } from '@/atoms/PostAtom'
import usePosts from '@/hook/usePost'
import PostItem from './PostForm/PostItem'
import PostLoader from './PostForm/PostLoader'

type PostsProps = {
  communityData?: Community
  userId?: string
  loadingUser: boolean
}

const Posts = ({ communityData, userId, loadingUser }: PostsProps) => {
  /**
   * PART OF INITIAL SOLUTION BEFORE CUSTOM HOOK
   */
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const { postStateValue, setPostStateValue, onVote, onDeletePost } = usePosts(
    communityData!
  )

  const onSelectPost = (post: Post) => {
    setPostStateValue((prev) => ({
      ...prev,
      selectedPost: post,
    }))
    post.id && router.push(`/r/${communityData?.id!}/comments/${post.id}`)
  }
  useEffect(() => {
    // if (
    //   postStateValue.postsCache[communityData?.id!] &&
    //   !postStateValue.postUpdateRequired
    // ) {
    //   setPostStateValue((prev) => ({
    //     ...prev,
    //     posts: postStateValue.postsCache[communityData?.id!],
    //   }))
    //   return
    // }

    getPosts()
  }, [communityData])

  const getPosts = async () => {
    setLoading(true)
    try {
      const postsQuery = query(
        collection(firestore, 'posts'),
        where('communityId', '==', communityData?.id!),
        orderBy('createdAt', 'desc')
      )
      const postDocs = await getDocs(postsQuery)
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
        postsCache: {
          ...prev.postsCache,
          [communityData?.id!]: posts as Post[],
        },
        postUpdateRequired: false,
      }))
    } catch (error: any) {
      console.error('getPosts error', error.message)
    }

    setLoading(false)
  }

  return (
    <>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack>
          {postStateValue.posts.map((post: Post) => (
            <PostItem
              key={post.id}
              post={post}
              onVote={onVote}
              onDeletePost={onDeletePost}
              userVoteValue={
                postStateValue.postVotes.find((item) => item.postId === post.id)
                  ?.voteValue
              }
              userIsCreator={userId === post.creatorId}
              onSelectPost={onSelectPost}
            />
          ))}
        </Stack>
      )}
    </>
  )
}
export default Posts
