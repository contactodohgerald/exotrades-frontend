import { 
    Box,
    Center,
    Table, 
    TableCaption, 
    Tbody, 
    Td, 
    Text, 
    Th, 
    Thead, 
    Tr,
    useColorMode
} from '@chakra-ui/react';
import React from 'react';

function TransactionTable(props) {
    const { caption, t_head, t_body} = props
    const { colorMode} = useColorMode()
    const isDark = colorMode === 'dark'
    return (
        <Table variant='striped' colorScheme={isDark ? 'gray' : 'facebook'} boxShadow={'lg'}>
            <TableCaption placement='top'>{caption}</TableCaption>
            <Thead>
            <Tr>
                {t_head.map((head, keys) => <Th key={keys}>{head}</Th>)}
            </Tr>
            </Thead>
            <Tbody>
                {
                    t_body.length ?
                    t_body.map((tr, value) => <Tr key={value}>{tr.map((body, index) =><Td key={index}>{body}</Td>)}</Tr>) :
                    <Box as={'tr'}>
                        <Center><Text p={'5'}>No Data Available at this Moment</Text></Center>
                    </Box>
                }
            </Tbody>
        </Table>
    );
}

export default TransactionTable;
