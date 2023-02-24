import useDirectory from '@/hook/useDirectory'
import { Box, Flex, Icon, Tooltip } from '@chakra-ui/react'
import { BsArrowUpRightCircle, BsChatDots } from 'react-icons/bs'
import { GrAdd } from 'react-icons/gr'
import {
  IoFilterCircleOutline,
  IoNotificationsOutline,
  IoVideocamOutline,
} from 'react-icons/io5'

const ActionIcons = () => {
  const { toggleMenuOpen } = useDirectory()
  return (
    <Flex alignItems='center' flexGrow={1}>
      <Box
        display={{ base: 'none', md: 'flex' }}
        alignItems='center'
        borderRight='1px solid'
        borderColor='gray.200'>
        <Tooltip fontSize='8pt' label='WIP' color='red.500' bg='white'>
          <Flex
            mr={1.5}
            ml={1.5}
            padding={1}
            cursor='pointer'
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}>
            <Icon as={BsArrowUpRightCircle} fontSize={20} />
          </Flex>
        </Tooltip>

        <Tooltip fontSize='8pt' label='WIP' color='red.500' bg='white'>
          <Flex
            mr={1.5}
            ml={1.5}
            padding={1}
            cursor='pointer'
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}>
            <Icon as={IoFilterCircleOutline} fontSize={22} />
          </Flex>
        </Tooltip>

        <Tooltip fontSize='8pt' label='WIP' color='red.500' bg='white'>
          <Flex
            mr={1.5}
            ml={1.5}
            padding={1}
            cursor='pointer'
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}>
            <Icon as={IoVideocamOutline} fontSize={22} />
          </Flex>
        </Tooltip>
      </Box>
      <>
        <Tooltip fontSize='8pt' label='WIP' color='red.500' bg='white'>
          <Flex
            mr={1.5}
            ml={1.5}
            padding={1}
            cursor='pointer'
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}>
            <Icon as={BsChatDots} fontSize={20} />
          </Flex>
        </Tooltip>

        <Tooltip fontSize='8pt' label='WIP' color='red.500' bg='white'>
          <Flex
            mr={1.5}
            ml={1.5}
            padding={1}
            cursor='pointer'
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}>
            <Icon as={IoNotificationsOutline} fontSize={20} />
          </Flex>
        </Tooltip>

        <Tooltip
          fontSize='8pt'
          label='Create Community'
          color='gray.500'
          bg='white'>
          <Flex
            display={{ base: 'none', md: 'flex' }}
            mr={3}
            ml={1.5}
            padding={1}
            cursor='pointer'
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}
            onClick={toggleMenuOpen}>
            <Icon as={GrAdd} fontSize={20} />
          </Flex>
        </Tooltip>
      </>
    </Flex>
  )
}
export default ActionIcons
