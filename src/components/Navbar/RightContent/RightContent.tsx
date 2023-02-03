import { authModalState } from '@/atoms/AuthModalAtom'
import AuthModal from '@/components/Modal/Auth/AuthModal'
import { Button, Flex } from '@chakra-ui/react'
import React from 'react'
import { useSetRecoilState } from 'recoil'

type Props = {}

export default function RightContent({}: Props) {
  const setAuthModalState = useSetRecoilState(authModalState)
  return (
    <>
      <AuthModal />
      <Flex justify='center' align='center'>
        <Button
          variant='outline'
          height='28px'
          display={{ base: 'none', sm: 'flex' }}
          width={{ base: '70px', md: '110px' }}
          mr={2}
          onClick={() => setAuthModalState({ open: true, type: 'login' })}>
          Log In
        </Button>
        <Button
          variant='solid'
          height='28px'
          display={{ base: 'none', sm: 'flex' }}
          width={{ base: '70px', md: '110px' }}
          mr={2}
          onClick={() => setAuthModalState({ open: true, type: 'signup' })}>
          Sign Up
        </Button>
      </Flex>
    </>
  )
}
