import { authModalState } from '@/atoms/AuthModalAtom'
import { Button, Flex, Input, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth, firestore } from '../../../firebase/clientApp'
import { FIREBASE_ERRORS } from '../../../firebase/errors'
import { User } from 'firebase/auth'
import { addDoc, collection } from 'firebase/firestore'

type Props = {}

export default function Signup({}: Props) {
  const setAuthModalState = useSetRecoilState(authModalState)
  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [createUserWithEmailAndPassword, userCreated, loading, userError] =
    useCreateUserWithEmailAndPassword(auth)
  const [formError, setFormError] = useState('')

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (formError) setFormError('')

    if (signupForm.password !== signupForm.confirmPassword) {
      setFormError('Passwords do not match')
      return
    }

    createUserWithEmailAndPassword(signupForm.email, signupForm.password)
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignupForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
  }

  //function chuyển auth user vào firestore
  const createUserDocument = async (user: User) => {
    await addDoc(
      collection(firestore, 'users'),
      JSON.parse(JSON.stringify(user))
    )
  }
  useEffect(() => {
    if (userCreated) {
      createUserDocument(userCreated?.user)
    }
  }, [userCreated])

  return (
    <form onSubmit={onSubmit}>
      <Input
        required
        name='email'
        placeholder='email'
        type='email'
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
      <Input
        required
        name='confirmPassword'
        placeholder='confirm password'
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
      {(formError || userError) && (
        <Text textAlign='left' mt={2} fontSize='10pt' color='red'>
          {formError ||
            // control firebase error message
            FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]}
        </Text>
      )}
      <Button
        width='100%'
        height='36px'
        mb={2}
        mt={2}
        type='submit'
        isLoading={loading}>
        Sign up
      </Button>

      <Flex fontSize='9pt' justifyContent='center'>
        <Text mr={1}>Already a redditor?</Text>
        <Text
          color='blue.500'
          fontWeight={700}
          cursor='pointer'
          onClick={() =>
            setAuthModalState((prev) => ({ ...prev, type: 'login' }))
          }>
          LOG IN
        </Text>
      </Flex>
    </form>
  )
}
