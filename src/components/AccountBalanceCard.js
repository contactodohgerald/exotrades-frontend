import { 
    Badge,
    Box, 
    Center, 
    Flex, 
    FormControl, 
    FormLabel, 
    Heading, 
    Spacer, 
    Stack, 
    Switch, 
    Text,
    useMediaQuery 
} from '@chakra-ui/react'
import React from 'react'
import { formater } from '../_formater'

function AccountBalanceCard({ user }) {
    const [isNotSmallerScreen] = useMediaQuery('(min-width: 600px)')
    return (
    <Center>
        <Box color={'white'} mt={'5'} p={'6'} w={isNotSmallerScreen ? 'xl' : 'full'} boxShadow={'2xl'} rounded={'xl'} bgGradient="linear(to-r, red, brown,red)" >
            <Flex>
                <Text fontWeight={'bold'}>{user ? user.name : 'None'}</Text>
                <Spacer />
                <Text fontWeight={'bold'}>{user ? user.status : 'None'}</Text>
            </Flex>
            <Stack textAlign={'center'} mt={'3'}>
                <Text fontSize={'md'}>MAIN BALANCE</Text>
                <Heading fontSize={'3xl'}>{formater.format(user ? user.main_balance : 0)}</Heading>
            </Stack>
            <Flex>
                <Box>
                    <Badge variant={'solid'} colorScheme={'teal'}>{user ? user.account_number : 'None'}</Badge>
                </Box>
                <Spacer />
                <Box>
                    <FormControl display='flex' >
                        <FormLabel htmlFor='hide_balance'>Hide Balance</FormLabel>
                        <Switch colorScheme='facebook' size='md' name='hide_balance' id='hide_balance' />
                    </FormControl>
                </Box>
            </Flex>
        </Box>
    </Center>
    )
}

export default AccountBalanceCard