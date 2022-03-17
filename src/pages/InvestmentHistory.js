import { 
    Badge, 
    Box,
    Text,
    Table, 
    TableCaption, 
    Tbody, 
    Td,
    Th, 
    Thead, 
    Tr,
    useColorMode,
    Stack, 
    Center
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { BASE_URL } from '../api_routes';
import API_TOKEN from '../token';
import BreadCrumb from '../components/BreadCrumb';
import MenuHolder from '../components/MenuHolder';
import PrimaryCard from '../components/PrimaryCard';
import Loader from '../components/Loader';
import { TRANS_COLUMN } from '../table_columns/transaction_column'
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import { formater } from '../_formater';
import swal from 'sweetalert'
import 'bootstrap/dist/css/bootstrap.min.css'

function InvestmentHistory() {
    const [transactions, setTransaction] = useState(null)

    const getListOfTransactions = (pageNumber = 1) => {
        axios.get(BASE_URL+`get-user-transactions?page=${pageNumber}`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}` 
            }
        })
        .then(respond => {
            const trans = respond.data.payload
            setTransaction(trans)
        })
        .catch(error => {
            const errorMsg = error.message
            swal({
                title: "Error",
                text: errorMsg,
                icon: "error"
            })
            return
        })
    }
    useEffect(() => {
        getListOfTransactions()
    }, [])

    const PaginateBody = () => {
        const {current_page, per_page, total } = transactions
        return (
            <Pagination
                activePage={current_page}
                itemsCountPerPage={per_page}
                totalItemsCount={total}
                pageRangeDisplayed={5}
                onChange={(pageNumber) => getListOfTransactions(pageNumber)}
                prevPageText='Prev'
                nextPageText='Next'
                itemClass='page-item'
                linkClass='page-link'
            />
        )
    }
  
    const links = [
        {
            url: '/dashboard',
            value: 'Dashboard',
        },
        {
            url: '/invest-history',
            value: 'Investment History',
        },
    ]
    const { colorMode} = useColorMode()
    const isDark = colorMode === 'dark'
    return transactions === null ? (
            <Loader /> 
        ) : (
        <Stack>
            <BreadCrumb links={links} />
            <PrimaryCard>
                <Box overflow={'scroll'}>
                <Table variant='striped' colorScheme={isDark ? 'gray' : 'facebook'} boxShadow={'lg'}>
                    <TableCaption placement='top'>Investment History</TableCaption>
                    <Thead>
                        <Tr>
                            {TRANS_COLUMN.map((header_column, index) => <Th key={index}>{header_column.Header}</Th>)}
                        </Tr>
                    </Thead>
                    <Tbody>
                    {
                        transactions.data.length ?
                        transactions.data.map((each_trans, indexs) => (
                            <Tr key={indexs}>
                                <Td>{indexs + 1}</Td>
                                <Td>{each_trans.plans.plan_name}</Td>
                                <Td>{formater.format(each_trans.amount)}</Td>
                                <Td>{formater.format(each_trans.intrest_growth)}</Td>
                                <Td>{each_trans.day_counter}</Td>
                                <Td>{each_trans.system_wallet.wallet_name}</Td>
                                <Td>
                                    <Badge variant={'outline'} colorScheme={each_trans.received_status === 'pending' ? 'red' : 'green'}>{each_trans.received_status}</Badge>
                                </Td>
                                <Td>
                                    <Link to={'/payment-invoice/'+each_trans.unique_id} ><MenuHolder /></Link>
                                </Td>
                            </Tr>
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

export default InvestmentHistory;
