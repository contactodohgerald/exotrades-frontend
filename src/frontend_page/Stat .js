import React from 'react'
import { Box, Heading, Stack, Text, useMediaQuery } from '@chakra-ui/react'

function Stat (props) {
    const [isNotSmallerScreen] = useMediaQuery('(min-width: 600px)')
    const { label, value, ...boxProps } = props
    return (
        <Box px={{ base: '4', md: '6' }} py={{ base: '5', md: '6' }} bg="bg-surface" borderRadius="lg" boxShadow={'lg'} {...boxProps}>
            <Stack>
                <Text fontSize="lg" color="muted">{label}</Text>
                <Heading size={isNotSmallerScreen ? 'lg' : 'md'}>{value}</Heading>
            </Stack>
        </Box>
    )
}

export default Stat 