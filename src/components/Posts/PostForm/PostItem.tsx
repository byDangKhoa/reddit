import React, { useState } from 'react'
import {
  Flex,
  Icon,
  Image,
  Skeleton,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useToast,
} from '@chakra-ui/react'
import { formatDistanceToNow } from 'date-fns'
import { NextRouter, useRouter } from 'next/router'
import { AiOutlineDelete } from 'react-icons/ai'
import { BsChat, BsDot } from 'react-icons/bs'
import { FaReddit } from 'react-icons/fa'
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from 'react-icons/io5'

import Link from 'next/link'
import { Post } from '@/atoms/PostAtom'

export type PostItemContentProps = {
  post: Post
  onVote: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    communityId: string,
    postIdx?: number
  ) => void
  onDeletePost: (post: Post) => Promise<boolean>
  userIsCreator: boolean
  onSelectPost?: (value: Post) => void
  router?: NextRouter
  postIdx?: number
  userVoteValue?: number
  homePage?: boolean
}

const PostItem = ({
  post,
  onVote,
  onSelectPost,
  onDeletePost,
  userVoteValue,
  userIsCreator,
  homePage,
}: PostItemContentProps) => {
  const [loadingImage, setLoadingImage] = useState(true)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const singlePostView = !onSelectPost // function not passed to [pid]
  const router = useRouter()
  const toast = useToast()

  const handleDelete = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation()
    setLoadingDelete(true)
    try {
      const success = await onDeletePost(post)
      if (!success) throw new Error('Failed to delete post')
      toast({
        title: 'Post',
        description: "'Post successfully deleted'",
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      if (singlePostView) {
        post.communityId && router.push(`/r/${post.communityId}`)
      }
    } catch (error: any) {
      toast({
        title: 'Post',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setLoadingDelete(false)
      // setError
    }
  }

  return (
    <Flex
      border='1px solid'
      bg='white'
      borderColor={singlePostView ? 'white' : 'gray.300'}
      borderRadius={singlePostView ? '4px 4px 0px 0px' : 4}
      cursor={singlePostView ? 'unset' : 'pointer'}
      _hover={{ borderColor: singlePostView ? 'none' : 'gray.500' }}
      onClick={() => onSelectPost && onSelectPost(post)}>
      <Flex
        direction='column'
        align='center'
        bg={singlePostView ? 'none' : 'gray.100'}
        p={2}
        width='40px'
        borderRadius={singlePostView ? '0' : '3px 0px 0px 3px'}>
        <Icon
          as={
            userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
          }
          color={userVoteValue === 1 ? 'brand.100' : 'gray.400'}
          fontSize={22}
          cursor='pointer'
          onClick={(event) => onVote(event, post, 1, post.communityId)}
        />
        <Text fontSize='9pt' fontWeight={600}>
          {post.voteStatus}
        </Text>
        <Icon
          as={
            userVoteValue === -1
              ? IoArrowDownCircleSharp
              : IoArrowDownCircleOutline
          }
          color={userVoteValue === -1 ? '#4379FF' : 'gray.400'}
          fontSize={22}
          cursor='pointer'
          onClick={(event) => onVote(event, post, -1, post.communityId)}
        />
      </Flex>
      <Flex direction='column' width='100%'>
        <Stack spacing={1} p='10px 10px'>
          {post.createdAt && (
            <Stack direction='row' spacing={0.6} align='center' fontSize='9pt'>
              {homePage && (
                <>
                  {post.communityImageURL ? (
                    <Image
                      alt='image'
                      borderRadius='full'
                      boxSize='18px'
                      src={post.communityImageURL}
                      mr={2}
                    />
                  ) : (
                    <Icon as={FaReddit} fontSize={18} mr={1} color='blue.500' />
                  )}
                  <Link href={`r/${post.communityId}`}>
                    <Text
                      fontWeight={700}
                      _hover={{ textDecoration: 'underline' }}
                      onClick={(event) =>
                        event.stopPropagation()
                      }>{`r/${post.communityId}`}</Text>
                  </Link>
                  <Icon as={BsDot} color='gray.500' fontSize={8} />
                </>
              )}
              <Text color='gray.500'>
                Posted by u/{post.creatorDisplayName}{' '}
                {formatDistanceToNow(new Date(post.createdAt.seconds * 1000))}
              </Text>
            </Stack>
          )}
          <Text fontSize='12pt' fontWeight={600}>
            {post.title}
          </Text>
          <Text
            dangerouslySetInnerHTML={{ __html: post.body }}
            fontSize='10pt'></Text>
          {post.imageURL && (
            <Flex justify='center' align='center' p={2}>
              {loadingImage && (
                <Skeleton height='200px' width='100%' borderRadius={4} />
              )}
              <Image
                // width="80%"
                // maxWidth="500px"
                maxHeight='460px'
                src={post.imageURL}
                display={loadingImage ? 'none' : 'unset'}
                onLoad={() => setLoadingImage(false)}
                alt='Post Image'
              />
            </Flex>
          )}
        </Stack>
        <Flex ml={1} mb={0.5} color='gray.500' fontWeight={600}>
          <Flex
            align='center'
            p='8px 10px'
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}
            cursor='pointer'>
            <Icon as={BsChat} mr={2} />
            <Text fontSize='9pt'>{post.numberOfComments}</Text>
          </Flex>
          <Tooltip fontSize='8pt' label='WIP' color='red.500' bg='white'>
            <Flex
              align='center'
              p='8px 10px'
              borderRadius={4}
              _hover={{ bg: 'gray.200' }}
              cursor='pointer'>
              <Icon as={IoArrowRedoOutline} mr={2} />
              <Text fontSize='9pt'>Share</Text>
            </Flex>
          </Tooltip>

          <Tooltip fontSize='8pt' label='WIP' color='red.500' bg='white'>
            <Flex
              align='center'
              p='8px 10px'
              borderRadius={4}
              _hover={{ bg: 'gray.200' }}
              cursor='pointer'>
              <Icon as={IoBookmarkOutline} mr={2} />
              <Text fontSize='9pt'>Save</Text>
            </Flex>
          </Tooltip>

          {userIsCreator && (
            <Flex
              align='center'
              p='8px 10px'
              borderRadius={4}
              _hover={{ bg: 'gray.200' }}
              cursor='pointer'
              onClick={handleDelete}>
              {loadingDelete ? (
                <Spinner size='sm' />
              ) : (
                <>
                  <Icon as={AiOutlineDelete} mr={2} />
                  <Text fontSize='9pt'>Delete</Text>
                </>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default PostItem
