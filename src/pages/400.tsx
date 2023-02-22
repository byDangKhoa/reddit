import React from 'react'
import { Flex, Button } from '@chakra-ui/react'
import Link from 'next/link'

function PageNotFound() {
  return (
    <Flex
      direction='column'
      justifyContent='center'
      alignItems='center'
      minHeight='60vh'>
      Sorry, page not found
      <Link href='/'>
        <Button mt={4}>GO HOME</Button>
      </Link>
    </Flex>
  )
}
export default PageNotFound
