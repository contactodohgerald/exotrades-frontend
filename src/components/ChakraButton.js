import React from 'react';
import { 
    Button, useColorMode } from '@chakra-ui/react'

function ChakraButton(props) {
    const { colorMode} = useColorMode()
    const isDark = colorMode === 'dark'
    const { label, ...rest } = props 
    return (
        // The size prop affects the height of the button
        // It can still be overridden by passing a custom height
        <Button
        size='lg'
        height='48px'
        width='100%'
        border='2px'
        borderColor={isDark ? 'red' : 'blue'}
        m='20px 0'
        {...rest}
        >
            {label}
        </Button>
    );
}

export default ChakraButton;
