import { Community } from '@/atoms/CommunitiesAtom'
import { firestore } from '@/firebase/clientApp'
import useCommunityData from '@/hook/useCommunityData'
import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { FaReddit } from 'react-icons/fa'
import dynamic from 'next/dynamic'
const AllCommunityModal = dynamic(() => import('./AllCommunityModal'), {
  ssr: false,
})
type Props = {
  communitiesData: Community[]
}
const Recommendations = ({ communitiesData }: Props) => {
  const [communities, setCommunities] = useState<Community[]>([])
  const { communityStateValue, onJoinLeaveCommunity } = useCommunityData()
  const router = useRouter()
  const [communityModal, setCommunityModal] = useState(false)

  useEffect(() => {
    setCommunities(communitiesData)
  }, [communitiesData])

  return (
    <Flex
      direction='column'
      bg='white'
      borderRadius={4}
      cursor='pointer'
      border='1px solid'
      borderColor='gray.300'>
      <Flex
        align='flex-end'
        color='white'
        p='6px 10px'
        bg='blue.500'
        height='70px'
        borderRadius='4px 4px 0px 0px'
        fontWeight={600}
        bgImage='url(/images/recCommsArt.png)'
        backgroundSize='cover'
        bgGradient="linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75)),
          url('images/recCommsArt.png')">
        Top Communities
      </Flex>
      <Flex direction='column'>
        {communities.length === 0 ? (
          <Stack mt={2} p={3}>
            <Flex justify='space-between' align='center'>
              <SkeletonCircle size='10' />
              <Skeleton height='10px' width='70%' />
            </Flex>
            <Flex justify='space-between' align='center'>
              <SkeletonCircle size='10' />
              <Skeleton height='10px' width='70%' />
            </Flex>
            <Flex justify='space-between' align='center'>
              <SkeletonCircle size='10' />
              <Skeleton height='10px' width='70%' />
            </Flex>
          </Stack>
        ) : (
          <>
            {communities.map((item: any, index: number) => {
              const isJoined = !!communityStateValue.mySnippets.find(
                (snippet) => snippet.communityId === item.id
              )
              return (
                <Flex
                  key={index}
                  position='relative'
                  align='center'
                  fontSize='10pt'
                  borderBottom='1px solid'
                  borderColor='gray.200'
                  p='10px 12px'
                  fontWeight={600}>
                  <Flex
                    onClick={() => {
                      item.id && router.push(`/r/${item.id}`)
                    }}
                    width='80%'
                    align='center'>
                    <Flex width='15%'>
                      <Text mr={2}>{index + 1}</Text>
                    </Flex>
                    <Flex align='center' width='80%'>
                      {item.imageURL ? (
                        <Image
                          alt='community image'
                          borderRadius='full'
                          boxSize='28px'
                          src={item.imageURL}
                          mr={2}
                        />
                      ) : (
                        <Icon
                          as={FaReddit}
                          fontSize={30}
                          color='brand.100'
                          mr={2}
                        />
                      )}
                      <span
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>{`r/${item.id}`}</span>
                    </Flex>
                  </Flex>
                  <Box position='absolute' right='10px'>
                    <Button
                      height='22px'
                      fontSize='8pt'
                      onClick={(event) => {
                        event.stopPropagation()
                        onJoinLeaveCommunity(item, isJoined)
                      }}
                      variant={isJoined ? 'outline' : 'solid'}>
                      {isJoined ? 'Joined' : 'Join'}
                    </Button>
                  </Box>
                </Flex>
              )
            })}

            <Box p='10px 20px'>
              <Button
                onClick={() => setCommunityModal(true)}
                height='30px'
                width='100%'>
                View All
              </Button>
            </Box>
          </>
        )}
      </Flex>
      <AllCommunityModal
        communityModal={communityModal}
        setCommunityModal={setCommunityModal}></AllCommunityModal>
    </Flex>
  )
}
export default Recommendations
