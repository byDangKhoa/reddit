import { ChevronDownIcon } from '@chakra-ui/icons'
import { Flex, Icon, Menu, MenuButton, MenuList, Text } from '@chakra-ui/react'

import { TiHome } from 'react-icons/ti'
import Communities from './Communities'

export default function Directory() {
  return (
    <Menu>
      <MenuButton
        width={{ base: 'auto', lg: '200px' }}
        mr={2}
        ml={{ base: 0, md: 2 }}
        cursor='pointer'
        padding='0 6px'
        borderRadius={4}
        _hover={{ outline: '1px solid', outlineColor: 'gray.200' }}>
        <Flex justify='space-between' align='center'>
          <Flex justify='flex-start' align='center'>
            <Icon mr={{ base: 1, md: 2 }} fontSize={24} as={TiHome}></Icon>
            <Flex display={{ base: 'none', lg: 'flex' }}>
              <Text fontSize='10pt' fontWeight={600}>
                Home
              </Text>
            </Flex>
          </Flex>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList>
        <Communities />
      </MenuList>
    </Menu>
  )
}
