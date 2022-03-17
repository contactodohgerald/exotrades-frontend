import React from 'react'
import { Flex, Text, useColorMode } from '@chakra-ui/react'

function CardBadge(props) {
    const { children, ...flexProps } = props
    const { colorMode} = useColorMode()
    const isDark = colorMode === 'dark'
    return (
        <Flex bg={isDark ? 'blue.200' : 'blue.500'} position="absolute" right={-20} top={6} width="240px" transform="rotate(45deg)" py={2} justifyContent="center" alignItems="center" {...flexProps}>
            <Text fontSize="xs" textTransform="uppercase" fontWeight="bold" letterSpacing="wider" color={isDark ? 'gray.800' : 'white'}>
                {children}
            </Text>
        </Flex>
    )
}

export default CardBadge