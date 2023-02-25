import { Button, Flex, Image, Tooltip } from '@chakra-ui/react'
import { User } from 'firebase/auth'
import { collection, doc, setDoc } from 'firebase/firestore'
import React, { useEffect } from 'react'
import { useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { auth, firestore } from '../../../firebase/clientApp'

export default function OAuthButton() {
  const [signInWithGoogle, userCreated, loading, error] =
    useSignInWithGoogle(auth)

  //function chuyển auth user vào firestore login = google
  const createUserDocument = async (user: User) => {
    const userDocRef = doc(firestore, 'users', user.uid)
    await setDoc(userDocRef, JSON.parse(JSON.stringify(user)))
  }
  useEffect(() => {
    if (userCreated) {
      createUserDocument(userCreated?.user)
    }
  }, [userCreated])
  return (
    <Flex direction='column' width='100%'>
      <Button
        fontSize={{ base: '7pt', md: '10pt' }}
        isLoading={loading}
        onClick={() => signInWithGoogle()}
        variant='oauth'
        mb='10px'>
        <Image
          alt='google logo'
          height='20px'
          mr='10px'
          src='/images/googlelogo.png'></Image>
        Continue with google
      </Button>
      <Tooltip
        fontSize={{ base: '7pt', md: '10pt' }}
        label='WIP'
        color='red.500'
        bg='white'>
        <Button fontSize={{ base: '7pt', md: '10pt' }} variant='oauth'>
          <Image
            alt='apple logo'
            height='20px'
            mr='10px'
            src='/images/applelogo.png'></Image>
          Continue with Apple
        </Button>
      </Tooltip>
    </Flex>
  )
}
