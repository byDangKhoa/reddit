import { Alert, AlertIcon, Flex, Icon, Text } from '@chakra-ui/react'
import React, { useReducer, useRef, useState } from 'react'

import { firestore, storage } from '@/firebase/clientApp'
import useSelectFile from '@/hook/useSelectFile'
import { User } from 'firebase/auth'
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { useRouter } from 'next/router'
import { BiPoll } from 'react-icons/bi'
import { BsLink45Deg, BsMic } from 'react-icons/bs'
import { IoDocumentText, IoImageOutline } from 'react-icons/io5'
import ImageUpload from './PostForm/ImageUpload'
import TextInputs from './PostForm/TextInput'
import TabItem from './TabItem'

const formTabs = [
  {
    title: 'Post',
    icon: IoDocumentText,
  },
  {
    title: 'Images & Video',
    icon: IoImageOutline,
  },
  {
    title: 'Link',
    icon: BsLink45Deg,
  },
  {
    title: 'Poll',
    icon: BiPoll,
  },
  {
    title: 'Talk',
    icon: BsMic,
  },
]

type NewPostFormProps = {
  user?: User | null
}
type TextInput = {
  title: string
  body: string
}
const NewPostForm = ({ user }: NewPostFormProps) => {
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title)

  const [textInputs, setTextInputs] = useReducer(
    (prev: TextInput, next: TextInput) => {
      return { ...prev, ...next }
    },
    { title: '', body: '' }
  )

  const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile()
  const selectFileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  //   const setPostItems = useSetRecoilState(postState);

  const handleCreatePost = async () => {
    setLoading(true)
    const communityId = router.query.id
    const body = {
      communityId: communityId as unknown as string,
      creatorId: user?.uid,
      creatorDisplayName: user?.email!.split('@')[0],
      title: textInputs.title,
      body: textInputs.body,
      numberOfComments: 0,
      voteStatus: 0,
      //   communityImageURL: string,
      //   currentUserVoteStatus: {
      //     id: string,
      //     voteValue: number,
      //   },
      //   imageURL: string,
      //   postIdx: number,
      //   editedAt: serverTimestamp() as unknown as Timestamp,
      createdAt: serverTimestamp() as unknown as Timestamp,
    }

    try {
      const postDocRef = await addDoc(collection(firestore, 'posts'), body)
      // // check if selectedFile exists, if it does, do image processing
      if (selectedFile) {
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`)
        await uploadString(imageRef, selectedFile, 'data_url')
        const downloadURL = await getDownloadURL(imageRef)
        await updateDoc(postDocRef, {
          imageURL: downloadURL,
        })
      }

      // Clear the cache to cause a refetch of the posts
      //   setPostItems((prev) => ({
      //     ...prev,
      //     postUpdateRequired: true,
      //   }))

      postDocRef.id &&
        router.push(`/r/${communityId}/comments/${postDocRef.id}`)
    } catch (error) {
      setError('Error creating post')
    }
    setLoading(false)
  }

  const onTextChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTextInputs({ [name]: value } as TextInput)
  }

  return (
    <Flex direction='column' bg='white' borderRadius={4} mt={2}>
      <Flex width='100%'>
        {formTabs.map((item, index) => (
          <TabItem
            key={index}
            item={item}
            selected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === 'Post' && (
          <TextInputs
            textInputs={textInputs}
            onChange={onTextChange}
            handleCreatePost={handleCreatePost}
            loading={loading}
          />
        )}
        {selectedTab === 'Images & Video' && (
          <ImageUpload
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            setSelectedTab={setSelectedTab}
            selectFileRef={selectFileRef}
            onSelectImage={onSelectFile}
          />
        )}
      </Flex>
      {error && (
        <Alert status='error'>
          <AlertIcon />
          <Text>Error creating post</Text>
        </Alert>
      )}
    </Flex>
  )
}
export default NewPostForm
