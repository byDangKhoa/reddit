import { Community, communityState } from '@/atoms/CommunitiesAtom'
import About from '@/components/Community/About'
import PageContent from '@/components/Layout/PageContent'
import NewPostForm from '@/components/Posts/NewPostForm'
import { auth } from '@/firebase/clientApp'
import useCommunityData from '@/hook/useCommunityData'

import { Box, Text } from '@chakra-ui/react'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRecoilState, useRecoilValue } from 'recoil'

export default function SubmitPage() {
  const [user] = useAuthState(auth)
  // const communityData = useRecoilValue(communityState)
  const { communityStateValue } = useCommunityData()

  return (
    <PageContent>
      <>
        <Box p='14px 0px' borderBottom='1px solid' borderColor='white'>
          <Text fontWeight={600}>Create a post</Text>
        </Box>
        {user && <NewPostForm user={user}></NewPostForm>}
      </>
      <>
        {communityStateValue.currentCommunity && (
          <About communityData={communityStateValue.currentCommunity} />
        )}
      </>
    </PageContent>
  )
}
