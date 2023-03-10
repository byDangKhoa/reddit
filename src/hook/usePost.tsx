import React, { useEffect, useState } from 'react'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
  writeBatch,
} from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { auth, firestore, storage } from '../firebase/clientApp'
import { useRouter } from 'next/router'
import { authModalState } from '@/atoms/AuthModalAtom'
import { Community, communityState } from '@/atoms/CommunitiesAtom'
import { Post, postState, PostVote } from '@/atoms/PostAtom'

const usePosts = (communityData?: Community) => {
  const [user, loadingUser] = useAuthState(auth)
  const [postStateValue, setPostStateValue] = useRecoilState(postState)
  const setAuthModalState = useSetRecoilState(authModalState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const communityStateValue = useRecoilValue(communityState)

  const onSelectPost = (post: Post) => {
    setPostStateValue((prev) => ({
      ...prev,
      selectedPost: post,
    }))
    post.communityId &&
      post.id &&
      router.push(`/r/${post.communityId}/comments/${post.id}`)
  }

  const onVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    communityId: string
  ) => {
    event.stopPropagation()
    if (!user?.uid) {
      setAuthModalState({ open: true, type: 'login' })
      return
    }

    const { voteStatus } = post
    const existingVote = postStateValue.postVotes.find(
      (vote) => vote.postId === post.id
    )
    // is this an upvote or a downvote?
    // has this user voted on this post already? was it up or down?

    try {
      const batch = writeBatch(firestore)

      const updatedPost = { ...post }
      const updatedPosts = [...postStateValue.posts]
      let updatedPostVotes = [...postStateValue.postVotes]
      let voteChange = vote

      // New vote
      if (!existingVote) {
        const postVoteRef = doc(
          collection(firestore, 'users', `${user.uid}/postVotes`)
        )

        const newVote: PostVote = {
          id: postVoteRef.id,
          postId: post.id,
          communityId,
          voteValue: vote,
        }

        // APRIL 25 - DON'T THINK WE NEED THIS
        // newVote.id = postVoteRef.id;

        batch.set(postVoteRef, newVote)

        updatedPost.voteStatus = voteStatus + vote
        updatedPostVotes = [...updatedPostVotes, newVote]
      }
      // Removing existing vote
      else {
        // Used for both possible cases of batch writes
        const postVoteRef = doc(
          firestore,
          'users',
          `${user.uid}/postVotes/${existingVote.id}`
        )

        // Removing vote
        if (existingVote.voteValue === vote) {
          updatedPost.voteStatus = voteStatus - vote
          updatedPostVotes = updatedPostVotes.filter(
            (vote) => vote.id !== existingVote.id
          )
          batch.delete(postVoteRef)
          voteChange *= -1
        }
        // Changing vote
        else {
          updatedPost.voteStatus = voteStatus + 2 * vote
          const voteIdx = postStateValue.postVotes.findIndex(
            (vote) => vote.id === existingVote.id
          )

          // Vote was found - findIndex returns -1 if not found

          updatedPostVotes[voteIdx] = {
            ...existingVote,
            voteValue: vote,
          }

          batch.update(postVoteRef, {
            voteValue: vote,
          })
          voteChange = 2 * vote
        }
      }
      if (postStateValue.selectedPost) {
        setPostStateValue((prev) => ({
          ...prev,
          selectedPost: updatedPost,
        }))
      }
      const postIdx = postStateValue.posts.findIndex(
        (item) => item.id === post.id
      )
      updatedPosts[postIdx] = updatedPost
      setPostStateValue((prev) => ({
        ...prev,
        posts: updatedPosts,
        postVotes: updatedPostVotes,
      }))
      // Update database
      const postRef = doc(firestore, 'posts', post.id)
      batch.update(postRef, { voteStatus: voteStatus + voteChange })
      await batch.commit()
    } catch (error) {
      console.error('onVote error', error)
    }
  }

  const onDeletePost = async (post: Post): Promise<boolean> => {
    try {
      // del img from storage
      if (post.imageURL) {
        const imageRef = ref(storage, `posts/${post.id}/image`)
        await deleteObject(imageRef)
      }

      // del post from db
      const postDocRef = doc(firestore, 'posts', post.id)
      await deleteDoc(postDocRef)

      // Update post state
      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((item) => item.id !== post.id),
        postsCache: {
          ...prev.postsCache,
          [post.communityId]: prev.postsCache[post.communityId]?.filter(
            (item) => item.id !== post.id
          ),
        },
      }))

      /**
       * Cloud Function will trigger on post delete
       * to delete all comments with postId === post.id
       */
      return true
    } catch (error) {
      console.error('THERE WAS AN ERROR', error)
      return false
    }
  }

  const getCommunityPostVotes = async (communityId: string) => {
    const postVotesQuery = query(
      collection(firestore, `users/${user?.uid}/postVotes`),
      where('communityId', '==', communityId)
    )
    const postVoteDocs = await getDocs(postVotesQuery)
    const postVotes = postVoteDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    setPostStateValue((prev) => ({
      ...prev,
      postVotes: postVotes as PostVote[],
    }))

    // const unsubscribe = onSnapshot(postVotesQuery, (querySnapshot) => {
    //   const postVotes = querySnapshot.docs.map((postVote) => ({
    //     id: postVote.id,
    //     ...postVote.data(),
    //   }));

    // });

    // return () => unsubscribe();
  }

  useEffect(() => {
    if (!user?.uid || !communityStateValue.currentCommunity) return
    getCommunityPostVotes(communityStateValue.currentCommunity.id)
  }, [user, communityStateValue.currentCommunity])

  /**
   * DO THIS INITIALLY FOR POST VOTES
   */
  // useEffect(() => {
  //   if (!user?.uid || !communityData) return;
  //   const postVotesQuery = query(
  //     collection(firestore, `users/${user?.uid}/postVotes`),
  //     where("communityId", "==", communityData?.id)
  //   );
  //   const unsubscribe = onSnapshot(postVotesQuery, (querySnapshot) => {
  //     const postVotes = querySnapshot.docs.map((postVote) => ({
  //       id: postVote.id,
  //       ...postVote.data(),
  //     }));

  //     setPostStateValue((prev) => ({
  //       ...prev,
  //       postVotes: postVotes as PostVote[],
  //     }));
  //   });

  //   return () => unsubscribe();
  // }, [user, communityData]);

  useEffect(() => {
    // Logout or no authenticated user
    if (!user?.uid && !loadingUser) {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }))
      return
    }
  }, [user, loadingUser])

  return {
    postStateValue,
    setPostStateValue,
    onSelectPost,
    onDeletePost,
    loading,
    setLoading,
    onVote,
    error,
  }
}

export default usePosts
