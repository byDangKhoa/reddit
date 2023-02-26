import { auth } from '@/firebase/clientApp'
import { Flex, Image } from '@chakra-ui/react'
import { User } from 'firebase/auth'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import Directory from './Directory/Directory'
import RightContent from './RightContent/RightContent'
import SearchInput from './SearchInput'

type Props = {}

function Navbar({}: Props) {
  const [user, loading, error] = useAuthState(auth)
  const router = useRouter()
  return (
    <Flex
      justify={{ md: 'space-between' }}
      bg='white'
      height='44px'
      padding='0px 12px'>
      <Flex
        justify='space-between'
        cursor='pointer'
        onClick={() => router.push('/')}
        align='center'>
        <Image alt='logo' src='/images/redditFace.svg' height='30px' />
        <Image
          alt='logo'
          src='/images/redditText.svg'
          height='46px'
          display={{ base: 'none', md: 'unset' }}
        />
      </Flex>

      {user && <Directory />}
      <SearchInput user={user as User} />
      <RightContent user={user as User} />
    </Flex>
  )
}

export default Navbar
