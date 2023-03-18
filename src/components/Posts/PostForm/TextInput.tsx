import React from 'react'
import { Stack, Input, Textarea, Flex, Button } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import styled from '@emotion/styled'
const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
})
const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'image', 'video'],
    ['clean'],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
}
const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
]

const StyledQuill = styled(QuillNoSSRWrapper)`
  .ql-container {
    min-height: 5rem;
    height: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .ql-editor {
    height: auto;
    flex: 1;
    overflow-y: auto;
    width: 100%;
  }
`
type TextInputsProps = {
  textInputs: {
    title: string
    body: string
  }
  setTextInputs: (event: any) => void
  handleCreatePost: () => void
  loading: boolean
}

const TextInputs = ({
  textInputs,
  setTextInputs,
  handleCreatePost,
  loading,
}: TextInputsProps) => {
  return (
    <Flex flexDirection='column'>
      <Stack spacing={3} width='100%'>
        <Input
          name='title'
          value={textInputs.title}
          onChange={(e) => setTextInputs({ title: e.target.value })}
          _placeholder={{ color: 'gray.500' }}
          _focus={{
            outline: 'none',
            bg: 'white',
            border: '1px solid',
            borderColor: 'black',
          }}
          fontSize='10pt'
          borderRadius={4}
          placeholder='Title'
        />
        <StyledQuill
          modules={modules}
          formats={formats}
          theme='snow'
          onChange={(value) => setTextInputs({ body: value })}
        />
        {/* <Textarea
          name='body'
          value={textInputs.body}
          onChange={onChange}
          fontSize='10pt'
          placeholder='Text (optional)'
          _placeholder={{ color: 'gray.500' }}
          _focus={{
            outline: 'none',
            bg: 'white',
            border: '1px solid',
            borderColor: 'black',
          }}
          height='100px'
        /> */}
      </Stack>
      <Flex justify='flex-end'>
        <Button
          marginTop={5}
          height='34px'
          padding='0px 30px'
          isDisabled={!textInputs.title}
          isLoading={loading}
          onClick={handleCreatePost}>
          Post
        </Button>
      </Flex>
    </Flex>
  )
}
export default TextInputs
