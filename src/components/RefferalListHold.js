import { 
    Box, 
    Center, 
    Stack, 
    Text,
    Table, 
    TableCaption, 
    Tbody, 
    Td, 
    Th, 
    Thead, 
    Tr, 
    useColorMode 
} from '@chakra-ui/react';
import React from 'react'
import Moment from 'react-moment';
import Pagination from 'react-js-pagination';
import Loader from './Loader';
import PrimaryCard from './PrimaryCard';

function RefferalListHold({ refferals, getListOfRefferrals }) {
    const PaginateBody = () => {
        const {current_page, per_page, total } = refferals
        return (
            <Pagination
            activePage={current_page}
            itemsCountPerPage={per_page}
            totalItemsCount={total}
            pageRangeDisplayed={5}
            onChange={(pageNumber) => getListOfRefferrals(pageNumber)}
            prevPageText='Prev'
            nextPageText='Next'
            itemClass='page-item'
            linkClass='page-link'
            />
        )
    }
    const { colorMode} = useColorMode()
    const isDark = colorMode === 'dark'
    return refferals === null ? (
            <Loader /> 
        ) : (
            <Stack>
                <PrimaryCard>
                    <Box overflow={'scroll'}>
                    <Table variant='striped' colorScheme={isDark ? 'gray' : 'facebook'} boxShadow={'lg'}>
                        <TableCaption placement='top'>Refferals History</TableCaption>
                        <Thead>
                            <Tr>
                                <Th>S/N</Th>
                                <Th>Referral Name</Th>
                                <Th>Referral Email</Th>
                                <Th>Date Joined</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                        {
                            refferals.length !== 0 ?
                            refferals.data.map((each_refferal, indexs) => (
                               <>
                                <Tr key={indexs}>
                                    <Td>{indexs + 1}</Td>
                                    <Td>{each_refferal.name}</Td>
                                    <Td>{each_refferal.email}</Td>
                                    <Td>
                                        <Moment format="DD/MM/YYYY">{each_refferal.created_at}</Moment>
                                    </Td>
                                </Tr>
                               </>
                            )) :
                            <Box as={'tr'}>
                                <Center><Text p={'5'}>No Data Available at this Moment</Text></Center>
                            </Box>
                        }
                        </Tbody>
                    </Table>
                    </Box>
                    <Center mt={'5'}>
                        { PaginateBody() }
                    </Center>
                </PrimaryCard>
            </Stack>
        );
}

export default RefferalListHold