import { authModalState } from '@/atoms/AuthModalAtom'
import { Flex } from '@chakra-ui/react'
import React from 'react'
import { useRecoilValue } from 'recoil'
import Login from './Login'
import Signup from './Signup'

export default function AuthInputs() {
  const modalState = useRecoilValue(authModalState)

  return (
    <Flex direction='column' alignItems='center' width='100%' mt={4}>
      {modalState.type === 'login' && <Login />}
      {modalState.type === 'signup' && <Signup />}
    </Flex>
  )
}
