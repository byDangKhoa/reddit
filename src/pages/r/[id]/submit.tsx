import PageContent from '@/components/Layout/PageContent'
import NewPostForm from '@/components/Posts/NewPostForm'
import { auth } from '@/firebase/clientApp'

import { Box, Text } from '@chakra-ui/react'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

export default function SubmitPage() {
  const user = useAuthState(auth)
  return (
    <PageContent>
      <>
        <Box p='14px 0px' borderBottom='1px solid' borderColor='white'>
          <Text fontWeight={600}>Create a post</Text>
        </Box>
        {user && <NewPostForm user={user[0]}></NewPostForm>}
      </>
      <>RHS</>
    </PageContent>
  )
}
