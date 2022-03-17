import { 
    Box, 
    Flex, 
    Heading, 
    IconButton, 
    Spacer, 
    Stack, 
} from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'

function ActionPerformerCard(props) {
    const {title, url, icon, bg } = props
    return (
        <Box mt={'5'} p={'8'} w={'full'} boxShadow={'2xl'} bgGradient={bg} color='white'>
            <Flex>
                <Stack>
                    <Heading fontSize={'3xl'}>{title}</Heading>
                </Stack>
                <Spacer />
                <Stack>
                    <Link to={url}>
                        <IconButton variant={'solid'}  colorScheme={'whiteAlpha'} aria-label='Invest' icon={icon}/>
                    </Link>
                </Stack>
            </Flex>
        </Box>
  )
}

export default ActionPerformerCard