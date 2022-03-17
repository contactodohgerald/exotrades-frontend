import { 
    Box, 
    useColorMode,
    useMediaQuery,
} from '@chakra-ui/react';
import React from 'react';

function PrimaryCard({ children }) {
    const { colorMode} = useColorMode()
    const isDark = colorMode === 'dark'
    const [isNotSmallerScreen] = useMediaQuery('(min-width: 600px)')
    return (
         <Box 
            w={'full'}
            boxShadow={'lg'}
            bg={isDark ? 'facebook.900' : 'white'}
            mb={'20'}
            p={isNotSmallerScreen ? '5' : '20px 0'}>
            {children}
        </Box>
    );
}

export default PrimaryCard;
