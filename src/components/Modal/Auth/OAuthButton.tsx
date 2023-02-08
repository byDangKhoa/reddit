import { Button, Flex, Image, Tooltip } from '@chakra-ui/react'
import React from 'react'
import { useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { auth } from '../../../firebase/clientApp'

export default function OAuthButton() {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth)

  return (
    <Flex direction='column' width='100%'>
      <Button
        isLoading={loading}
        onClick={() => signInWithGoogle()}
        variant='oauth'
        mb='10px'>
        <Image
          alt='google logo'
          height='20px'
          mr='4px'
          src='/images/googlelogo.png'></Image>
        Continue with google
      </Button>
      <Tooltip label='WIP' color='red.500' bg='white'>
        <Button variant='oauth'>
          <Image
            alt='apple logo'
            height='20px'
            mr='4px'
            src='/images/applelogo.png'></Image>
          Continue with Apple
        </Button>
      </Tooltip>
    </Flex>
  )
}
