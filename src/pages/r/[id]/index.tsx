import { useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import type { GetServerSidePropsContext } from 'next'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRecoilState, useSetRecoilState } from 'recoil'

import { auth, firestore } from '../../../firebase/clientApp'
import { Community, communityState } from '@/atoms/CommunitiesAtom'

import Header from '@/components/Community/Header'
import safeJsonStringify from 'safe-json-stringify'

import PageContent from '@/components/Layout/PageContent'
import CreatePostLink from '@/components/Community/CreatePostLink'
import CommunityNotFound from '@/components/Community/CommunityNotFound'
import Posts from '@/components/Posts/Post'
import About from '@/components/Community/About'

interface CommunityPageProps {
  communityData: Community
}

const CommunityPage = ({ communityData }: CommunityPageProps) => {
  const [user, loadingUser] = useAuthState(auth)

  const setCommunityStateValue = useSetRecoilState(communityState)

  useEffect(() => {
    setCommunityStateValue((prev) => ({
      ...prev,
      currentCommunity: communityData,
    }))
  }, [communityData])

  // Community was not found in the database
  if (!communityData) {
    return <CommunityNotFound />
  }

  return (
    <>
      <Header communityData={communityData} />
      <PageContent>
        <>
          <CreatePostLink />
          <Posts
            communityData={communityData}
            userId={user?.uid}
            loadingUser={loadingUser}
          />
        </>

        <>
          <About communityData={communityData} />
        </>
      </PageContent>
    </>
  )
}

export default CommunityPage

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const communityDocRef = doc(
      firestore,
      'communities',
      context.query.id as string
    )
    const communityDoc = await getDoc(communityDocRef)
    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(
              safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() }) // needed for dates
            )
          : '',
      },
    }
  } catch (error) {
    // Could create error page here
    return { props: { communityData: '' } }
  }
}
