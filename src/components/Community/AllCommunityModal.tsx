import { Community } from '@/atoms/CommunitiesAtom'
import { firestore } from '@/firebase/clientApp'
import useCommunityData from '@/hook/useCommunityData'
import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
} from '@chakra-ui/react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import router from 'next/router'
import { useEffect, useState } from 'react'
import { FaReddit } from 'react-icons/fa'

type Props = {
  communityModal: boolean
  setCommunityModal: (value: boolean) => void
}

function AllCommunityModal({ communityModal, setCommunityModal }: Props) {
  const [communities, setCommunities] = useState<Community[]>([])
  const { communityStateValue, onJoinLeaveCommunity } = useCommunityData()
  const [loading, setLoading] = useState(false)

  const getAllCommunities = async () => {
    setLoading(true)
    try {
      const communityQuery = query(
        collection(firestore, 'communities'),
        orderBy('numberOfMembers', 'desc')
      )
      const communityDocs = await getDocs(communityQuery)
      const communities = communityDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Community[]

      setCommunities(communities)
    } catch (error: any) {
      console.error('getCommunityRecommendations error', error.message)
    }
    setLoading(false)
  }
  useEffect(() => {
    communityModal && getAllCommunities()
  }, [communityModal])

  return (
    <Modal
      size='6xl'
      isOpen={communityModal}
      onClose={() => setCommunityModal(false)}>
      <ModalOverlay />
      <ModalContent width='90%'>
        <ModalCloseButton />
        <ModalBody
          display='flex'
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          pt={12}
          pb={6}>
          <Flex width='100%' direction='column'>
            {loading ? (
              <Stack mt={2} p={3}>
                <Flex justify='space-between' align='center'>
                  <SkeletonCircle size='10' />
                  <Skeleton height='10px' width='90%' />
                </Flex>
                <Flex justify='space-between' align='center'>
                  <SkeletonCircle size='10' />
                  <Skeleton height='10px' width='90%' />
                </Flex>
                <Flex justify='space-between' align='center'>
                  <SkeletonCircle size='10' />
                  <Skeleton height='10px' width='90%' />
                </Flex>
              </Stack>
            ) : (
              <>
                {communities.map((item, index) => {
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
                        cursor='pointer'
                        onClick={() => {
                          setCommunityModal(false)
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
              </>
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default AllCommunityModal
