import { Button, Flex, Image, Tooltip } from '@chakra-ui/react'
import { User } from 'firebase/auth'
import { collection, doc, setDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import {
  FacebookAuthProvider,
  signInWithPopup,
  GoogleAuthProvider,
  TwitterAuthProvider,
} from 'firebase/auth'

import { auth, firestore } from '../../../firebase/clientApp'

function getProvider(type: string) {
  switch (type) {
    case 'google':
      return new GoogleAuthProvider()
    case 'facebook':
      return new FacebookAuthProvider()
    case 'twitter':
      return new TwitterAuthProvider()
    default:
      throw new Error(`No provider implemented for ${type}`)
  }
}

export default function OAuthButton() {
  const [loading, setLoading] = useState(false)

  //function chuyển auth user vào firestore login = google
  const onloginSocial = async (type: string) => {
    setLoading(true)
    try {
      //cài đặt provider đăng nhập facebook
      getProvider(type).addScope('email')
      signInWithPopup(auth, getProvider(type))
        .then(function (result) {
          createUserDocument(result.user)
        })
        .catch(function (error) {
          console.error('Error: hande error here>>>', error.code)
        })
        .finally(() => setLoading(false))
    } catch (e) {
      console.log(e)
      setLoading(false)
    }
  }
  const createUserDocument = async (user: User) => {
    const userDocRef = doc(firestore, 'users', user.uid)
    await setDoc(userDocRef, JSON.parse(JSON.stringify(user)))
  }
  return (
    <Flex direction='column' width='100%'>
      <Button
        fontSize={{ base: '7pt', md: '10pt' }}
        isLoading={loading}
        onClick={() => onloginSocial('google')}
        variant='oauth'
        mb='10px'>
        <Image
          alt='google logo'
          height='20px'
          mr='10px'
          src='/images/googlelogo.png'></Image>
        Continue with google
      </Button>
      <Button
        fontSize={{ base: '7pt', md: '10pt' }}
        isLoading={loading}
        onClick={() => onloginSocial('facebook')}
        variant='oauth'
        mb='10px'>
        <Image
          alt='facebook logo'
          height='20px'
          mr='10px'
          src='/images/facebooklogo.png'></Image>
        Continue with facebook
      </Button>

      <Tooltip
        fontSize={{ base: '7pt', md: '10pt' }}
        label='WIP'
        color='red.500'
        bg='white'>
        <Button
          fontSize={{ base: '7pt', md: '10pt' }}
          isLoading={loading}
          variant='oauth'
          mb='10px'>
          <Image
            alt='twitter logo'
            height='20px'
            mr='10px'
            src='/images/twitterlogo.png'></Image>
          Continue with twitter
        </Button>
      </Tooltip>
    </Flex>
  )
}
