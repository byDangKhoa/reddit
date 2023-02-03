import { FormControl, FormLabel, Input, FormHelperText } from '@chakra-ui/react'
import React from 'react'

type Props = {}

export default function Signup({}: Props) {
  return (
    <FormControl>
      <FormLabel>Signup</FormLabel>
      <Input type='email' />
      <Input type='password' />
      <FormHelperText>We'll never share your email.</FormHelperText>
    </FormControl>
  )
}
