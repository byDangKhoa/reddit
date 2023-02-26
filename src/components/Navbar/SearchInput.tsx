import { SearchIcon } from '@chakra-ui/icons'
import { Flex, Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { User } from 'firebase/auth'
import React from 'react'

type Props = {
  user: User | null
}

function SearchInput({ user }: Props) {
  function onSearchCommunities(e: React.ChangeEvent<HTMLInputElement>) {
    console.log('Search', e.target.value)
  }
  return (
    <Flex maxWidth={user ? 'auto' : '600px'} flex='1' mr={2} align='center'>
      <InputGroup>
        <InputLeftElement height='34px' width='34px' pointerEvents='none'>
          <SearchIcon color='gray.400' />
        </InputLeftElement>

        <Input
          borderRadius='60px'
          placeholder='Work in progress'
          fontSize='10pt'
          _placeholder={{ color: 'gray.500' }}
          _hover={{ bg: 'white', border: '1px solid blue.500' }}
          _focus={{ outline: 'none', border: '1px solid blue.500' }}
          height='34px'
          bg='gray.50'
        />
      </InputGroup>
    </Flex>
  )
}

export default SearchInput
