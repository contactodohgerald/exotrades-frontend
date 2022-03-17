import React from 'react';
import { 
    useColorMode,
    Tooltip,
    useMediaQuery
  } from '@chakra-ui/react'
import { 
    IconButton 
} from '@chakra-ui/button'
import {
    FaSun, 
    FaMoon, 
} from 'react-icons/fa'

function ModeToggle() {
    const { colorMode, toggleColorMode } = useColorMode()
    const isDark = colorMode === 'dark'
    const [isNotSmallerScreen] = useMediaQuery('(min-width: 600px)')
    return (
        <Tooltip label={isDark ? 'Dark' : 'Light'} fontSize='sm'>
            <IconButton 
            border='1px'
            pos="fixed" 
            zIndex={2}
            top={isNotSmallerScreen ? '20em' : '15em'} 
            right="0"
            icon={isDark ? <FaSun/> : <FaMoon/>} 
            isRound={true} 
            onClick={toggleColorMode}></IconButton>
        </Tooltip>
    );
}

export default ModeToggle;
