import { authModalState } from '@/atoms/AuthModalAtom'
import AuthModal from '@/components/Modal/Auth/AuthModal'
import { auth } from '@/firebase/clientApp'
import { Button, Flex } from '@chakra-ui/react'
import { User } from 'firebase/auth'
import React from 'react'
import { useSignOut } from 'react-firebase-hooks/auth'
import { useSetRecoilState } from 'recoil'
import ActionIcons from './AuthIcons'
import UserMenu from './UserMenu'

type Props = {
  user: User
}

export default function RightContent({ user }: Props) {
  const setAuthModalState = useSetRecoilState(authModalState)

  return (
    <>
      <AuthModal />
      <Flex justify='space-between' align='center'>
        {user ? (
          <>
            <ActionIcons />
          </>
        ) : (
          <>
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
          </>
        )}
        <UserMenu user={user} />
      </Flex>
    </>
  )
}
