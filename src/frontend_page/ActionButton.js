import React from 'react'
import { Button } from '@chakra-ui/react'

function ActionButton(props) {
  return <Button colorScheme="blue" size="lg" w="full" fontWeight="extrabold" py={{ md: '8' }} {...props} />
}

export default ActionButton