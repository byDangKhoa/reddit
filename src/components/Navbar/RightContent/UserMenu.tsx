import { auth } from '@/firebase/clientApp'

import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Icon,
  Flex,
  MenuDivider,
  Text,
} from '@chakra-ui/react'
import { User } from 'firebase/auth'
import React from 'react'
import { useSignOut } from 'react-firebase-hooks/auth'
import { FaRedditSquare } from 'react-icons/fa'
import { VscAccount } from 'react-icons/vsc'
import { IoSparkles } from 'react-icons/io5'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { CgProfile } from 'react-icons/cg'
import { MdOutlineLogin } from 'react-icons/md'
import { useSetRecoilState } from 'recoil'
import { authModalState } from '@/atoms/AuthModalAtom'

type Props = {
  user?: User | null
}

export default function UserMenu({ user }: Props) {
  const setAuthModalState = useSetRecoilState(authModalState)
  const [signOut] = useSignOut(auth)
  return (
    <Menu>
      <MenuButton
        width={{ base: 'auto', md: '200px' }}
        cursor='pointer'
        padding='0 6px'
        borderRadius={4}
        _hover={{ outline: '1px solid', outlineColor: 'gray.200' }}>
        <Flex justify='space-between' align='center'>
          {user ? (
            <Flex align='center'>
              <Icon
                fontSize={24}
                mr={1}
                color='gray.300'
                as={FaRedditSquare}></Icon>
              <Flex justify='center' alignItems='center' direction='column'>
                <Text fontSize='8pt' fontWeight={700}>
                  {user?.displayName || user?.email?.split('@')[0]}
                </Text>
                <Flex alignItems='center'>
                  <Icon as={IoSparkles} color='brand.100' mr={1} />
                  <Text fontSize='8pt' color='gray.400'>
                    1 karma
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          ) : (
            <Icon fontSize={24} mr={1} color='gray.200' as={VscAccount}></Icon>
          )}
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList>
        {user ? (
          <>
            <MenuItem
              fontSize='10pt'
              fontWeight={700}
              _hover={{ bg: 'blue.500', color: 'white' }}>
              <Flex alignItems='center'>
                <Icon fontSize={20} mr={2} as={CgProfile} />
                Profile
              </Flex>
            </MenuItem>
            <MenuDivider />
            <MenuItem
              fontSize='10pt'
              fontWeight={700}
              _hover={{ bg: 'blue.500', color: 'white' }}
              onClick={() => signOut()}>
              <Flex alignItems='center'>
                <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
                Log Out
              </Flex>
            </MenuItem>
          </>
        ) : (
          <MenuItem
            fontSize='10pt'
            fontWeight={700}
            _hover={{ bg: 'blue.500', color: 'white' }}
            onClick={() =>
              setAuthModalState({
                type: 'login',
                open: true,
              })
            }>
            <Flex alignItems='center'>
              <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
              Log in / Sign up
            </Flex>
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  )
}
