import React from 'react'
import { Button, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react'

function SubscribeForm({isDark}) {
  return (
    <Stack as="form" spacing="3" onSubmit={(e) => { e.preventDefault()}}>
    <FormControl id="email">
      <FormLabel srOnly>Enter Your Email</FormLabel>
      <Input type="email" placeholder="Enter Your Email" size="lg" fontSize="md" focusBorderColor={isDark ? 'blue.500' : 'blue.200'}
/>
    </FormControl>
    <Button type="submit" fontWeight="bold" textTransform="uppercase" fontSize="md" colorScheme="blue" size="lg">Subscribe</Button>
  </Stack>
  )
}

export default SubscribeForm