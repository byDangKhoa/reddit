import { Box, Flex, Icon, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { BiBarChartAlt2, BiUpvote } from 'react-icons/bi'

import { BsBarChartFill, BsBarChartLine, BsLink45Deg } from 'react-icons/bs'
import { FaReddit } from 'react-icons/fa'
import { GrAnalytics } from 'react-icons/gr'
import { HiOutlineChartBar } from 'react-icons/hi'
import { IoImageOutline } from 'react-icons/io5'
import { MdOutlineNewReleases } from 'react-icons/md'

const filterButtons = [
  {
    id: 1,
    title: 'Default',
    icon: BsBarChartLine,
  },
  {
    id: 2,
    title: 'Top',
    icon: BiBarChartAlt2,
  },

  {
    id: 3,
    title: 'New',
    icon: MdOutlineNewReleases,
  },
]

type Props = {
  category: string
  setCategory: (value: string) => void
}

function FilterPost({ category, setCategory }: Props) {
  return (
    <Flex
      justify='flex-start'
      align='center'
      bg='white'
      height='56px'
      borderRadius={4}
      border='1px solid'
      borderColor='gray.300'
      p={2}
      mb={4}>
      {filterButtons.map((btn) => (
        <Flex
          onClick={() => setCategory(btn.title)}
          bg={category === btn.title ? 'gray.300' : 'white'}
          ml={2}
          key={btn.id}
          padding='6px 8px'
          justifyContent='center'
          alignItems='center'
          borderRadius='20px'
          _hover={{ bg: category === btn.title || 'gray.50' }}
          color={category === btn.title ? 'blue.500' : 'gray.500'}
          fontWeight='700'
          cursor='pointer'>
          <Icon mr={2} as={btn.icon} fontSize={24} />
          <Text fontSize='10pt'>{btn.title}</Text>
        </Flex>
      ))}
    </Flex>
  )
}

export default FilterPost
