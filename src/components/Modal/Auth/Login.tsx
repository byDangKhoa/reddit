import { authModalState } from '@/atoms/AuthModalAtom'
import { FIREBASE_ERRORS } from '@/firebase/errors'
import { background, Button, Flex, Input, Text } from '@chakra-ui/react'
import { Bubblegum_Sans, Preahvihear } from '@next/font/google'
import { generateKey } from 'crypto'
import React, { useState } from 'react'
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { useSetRecoilState } from 'recoil'
import { auth } from '../../../firebase/clientApp'

type Props = {}

export default function Login({}: Props) {
  const setAuthModalState = useSetRecoilState(authModalState)
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })
  const [signInWithEmailAndPassword, _, loading, authError] =
    useSignInWithEmailAndPassword(auth)
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    signInWithEmailAndPassword(loginForm.email, loginForm.password)
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
        borderRadius='60px'
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
        borderRadius='60px'
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

      <Button
        bg='rgb(217, 58, 0)'
        width='100%'
        height='36px'
        mb={2}
        mt={2}
        _hover={{ bg: 'rgb(217, 78, 0)' }}
        type='submit'
        isLoading={loading}>
        Log In
      </Button>
      {authError && (
        <Text mb={2} textAlign='center' mt={2} fontSize='10pt' color='red'>
          {FIREBASE_ERRORS[authError?.message as keyof typeof FIREBASE_ERRORS]}
        </Text>
      )}
      <Flex justifyContent='center' mb={2}>
        <Text fontSize='9pt' mr={1}>
          Forgot your password?
        </Text>
        <Text
          fontSize='9pt'
          color='blue.500'
          cursor='pointer'
          onClick={() =>
            setAuthModalState((prev) => ({ ...prev, type: 'resetPassword' }))
          }>
          Reset
        </Text>
      </Flex>
      <Flex fontSize='9pt' justifyContent='center'>
        <Text mr={1}>New here?</Text>
        <Text
          color='blue.500'
          fontWeight={700}
          cursor='pointer'
          onClick={() =>
            setAuthModalState((prev) => ({ ...prev, type: 'signup' }))
          }>
          SIGN UP
        </Text>
      </Flex>
    </form>
  )
}
