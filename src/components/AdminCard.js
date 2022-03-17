import { Box, Center, Flex, Heading, Icon, Spacer, Text } from '@chakra-ui/react'
import React from 'react'

function AdminCard(props) {
    const {bg, text, title, value, icon, color} = props
    return (
        <Box color={text} bg={bg} p={5} boxShadow={'2xl'} rounded={'md'}>
            <Flex>
                <Box>
                    <Text>{title}</Text>
                    <Heading>{value}</Heading>
                </Box>
                <Spacer/>
                <Center>
                    <Icon color={color} as={icon} w={10} h={10}/>
                </Center>
            </Flex>
        </Box>
  )
}

export default AdminCard