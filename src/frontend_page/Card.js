import React from 'react'
import { Box, useColorMode } from '@chakra-ui/react'
import CardBadge from './CardBadge'


function Card(props) {
    const { children, isPopular, ...rest } = props
    const { colorMode} = useColorMode()
    const isDark = colorMode === 'dark'
    return (
        <Box bg={isDark ? 'gray.700' : 'white'} position="relative" px="6" pb="6" pt="16" overflow="hidden" shadow="lg" maxW="md" width="100%"{...rest}>
            {isPopular && <CardBadge>Popular</CardBadge>}
            {children}
        </Box>
    )
}

export default Card