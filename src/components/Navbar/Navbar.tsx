import { Flex, Image } from '@chakra-ui/react'
import React from 'react'
import RightContent from './RightContent/RightContent'
import SearchInput from './SearchInput'

type Props = {}

function Navbar({}: Props) {
  return (
    <Flex bg='white' height='44px' padding='6px 12px'>
      <Flex align='center'>
        <Image alt='logo' src='/images/redditFace.svg' height={30} />
        <Image
          alt='logo'
          src='/images/redditText.svg'
          height='46px'
          display={{ base: 'none', md: 'unset' }}
        />
      </Flex>
      <SearchInput />
      <RightContent />
    </Flex>
  )
}

export default Navbar
