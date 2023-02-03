import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react'
import { Bubblegum_Sans } from '@next/font/google'
import { generateKey } from 'crypto'
import React, { useState } from 'react'

type Props = {}

export default function Login({}: Props) {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })
  const [formError, setFormError] = useState('')

  //   const [signInWithEmailAndPassword, _, loading, authError] =
  //     useSignInWithEmailAndPassword(auth)

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (formError) setFormError('')
    if (!loginForm.email.includes('@')) {
      return setFormError('Please enter a valid email')
    }

    // Valid form inputs
    // signInWithEmailAndPassword(form.email, form.password)
  }

  const onChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  return (
    <form onSubmit={onSubmit}>
      <Input
        required
        name='email'
        placeholder='email'
        type='text'
        onChange={onChange}
        mb={2}
        fontSize='10pt'
        _placeholder={{ color: 'gray.500' }}
        _hover={{
          bg: 'white',
          border: '1px solid blue.500',
        }}
        _focus={{
          outline: 'none',
          bg: 'white',
          border: '1px solid blue.500',
        }}
        bg='gray.50'
      />
      <Input
        required
        name='password'
        placeholder='password'
        type='password'
        onChange={onChange}
        mb={2}
        fontSize='10pt'
        _placeholder={{ color: 'gray.500' }}
        _hover={{
          bg: 'white',
          border: '1px solid blue.500',
        }}
        _focus={{
          outline: 'none',
          bg: 'white',
          border: '1px solid blue.500',
        }}
        bg='gray.50'
      />
      <Text textAlign='center' mt={2} fontSize='10pt' color='red'>
        {/* {formError ||
          FIREBASE_ERRORS[authError?.message as keyof typeof FIREBASE_ERRORS]} */}
      </Text>
      <Button
        width='100%'
        height='36px'
        mb={2}
        mt={2}
        type='submit'
        // isLoading={loading}
      >
        Log In
      </Button>
      {/* <Flex justifyContent='center' mb={2}>
        <Text fontSize='9pt' mr={1}>
          Forgot your password?
        </Text>
        <Text
          fontSize='9pt'
          color='blue.500'
          cursor='pointer'
          onClick={() => toggleView('resetPassword')}>
          Reset
        </Text>
      </Flex>
      <Flex fontSize='9pt' justifyContent='center'>
        <Text mr={1}>New here?</Text>
        <Text
          color='blue.500'
          fontWeight={700}
          cursor='pointer'
          onClick={() => toggleView('signup')}>
          SIGN UP
        </Text>
      </Flex> */}
    </form>
  )
}
