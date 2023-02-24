import { useEffect, useState } from 'react'
import { doc, getDoc, increment, writeBatch } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRecoilState, useSetRecoilState } from 'recoil'

import { getMySnippets } from '../helpers/firestore'
import { auth, firestore } from '@/firebase/clientApp'
import {
  Community,
  CommunitySnippet,
  communityState,
  defaultCommunity,
} from '@/atoms/CommunitiesAtom'
import { authModalState } from '@/atoms/AuthModalAtom'

// Add ssrCommunityData near end as small optimization
const useCommunityData = (ssrCommunityData?: boolean) => {
  const [user] = useAuthState(auth)
  const router = useRouter()
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState)
  const setAuthModalState = useSetRecoilState(authModalState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const getSnippets = async () => {
    setLoading(true)
    try {
      const snippets = await getMySnippets(user?.uid!)
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
        snippetsFetched: true,
      }))
      setLoading(false)
    } catch (error: any) {
      setError(error.message)
    }
    setLoading(false)
  }

  const getCommunityData = async (communityId: string) => {
    // this causes weird memory leak error - not sure why
    // setLoading(true);
    try {
      const communityDocRef = doc(firestore, 'communities', communityId)
      const communityDoc = await getDoc(communityDocRef)

      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          id: communityDoc.id,
          ...communityDoc.data(),
        } as Community,
      }))
    } catch (error: any) {
      console.error('getCommunityData error', error.message)
    }
    setLoading(false)
  }

  const onJoinLeaveCommunity = (community: Community, isJoined?: boolean) => {
    if (!user) {
      setAuthModalState({ open: true, type: 'login' })
      return
    }

    setLoading(true)
    if (isJoined) {
      leaveCommunity(community.id)
      return
    }
    joinCommunity(community)
  }

  const joinCommunity = async (community: Community) => {
    try {
      const batch = writeBatch(firestore)

      const newSnippet: CommunitySnippet = {
        communityId: community.id,
        imageURL: community.imageURL || '',
        isModerator: user?.uid === community.creatorId,
      }
      batch.set(
        doc(
          firestore,
          `users/${user?.uid}/communitySnippets`,
          community.id // will for sure have this value at this point
        ),
        newSnippet
      )

      batch.update(doc(firestore, 'communities', community.id), {
        numberOfMembers: increment(1),
      })

      // perform batch writes
      await batch.commit()

      // Add current community to snippet
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet],
      }))
    } catch (error) {
      console.error('joinCommunity error', error)
    }
    setLoading(false)
  }

  const leaveCommunity = async (communityId: string) => {
    try {
      const batch = writeBatch(firestore)

      batch.delete(
        doc(firestore, `users/${user?.uid}/communitySnippets/${communityId}`)
      )

      batch.update(doc(firestore, 'communities', communityId), {
        numberOfMembers: increment(-1),
      })

      await batch.commit()

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(
          (item) => item.communityId !== communityId
        ),
      }))
    } catch (error) {
      console.error('leaveCommunity error', error)
    }
    setLoading(false)
  }
  useEffect(() => {
    if (!user) {
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [],
        snippetsFetched: false,
      }))
      return
    }

    getSnippets()
  }, [user])
  useEffect(() => {
    // if (ssrCommunityData) return;
    const communityId = router.query.id
    if (communityId) {
      const communityData = communityStateValue.currentCommunity

      if (!communityData?.id) {
        getCommunityData(communityId as string)
        return
      }
    } else {
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: defaultCommunity,
      }))
    }
  }, [router.query, communityStateValue.currentCommunity])

  return {
    communityStateValue,
    onJoinLeaveCommunity,
    loading,
    setLoading,
    error,
  }
}

export default useCommunityData
