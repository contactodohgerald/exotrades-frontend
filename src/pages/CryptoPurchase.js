import { 
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
    Center,
    Button,
    Image
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { BASE_URL } from '../api_routes';
import API_TOKEN from '../token';
import BreadCrumb from '../components/BreadCrumb';
import PrimaryCard from '../components/PrimaryCard';
import Loader from '../components/Loader';
import { COINS_COLUMN } from '../table_columns/coins_column';
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import { formater } from '../_formater';
import swal from 'sweetalert'
import 'bootstrap/dist/css/bootstrap.min.css'
import { FiArrowRight } from 'react-icons/fi';

function CryptoPurchase() {
    const [coins, setCoin] = useState(null)

    const getListOfCoins = (pageNumber = 1) => {
        axios.get(BASE_URL+`crypto-purchase-list?page=${pageNumber}`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}` 
            }
        })
        .then(respond => {
            const coin = respond.data.payload
            setCoin(coin)
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
        getListOfCoins()
    }, [])

    const PaginateBody = () => {
        const {current_page, per_page, total } = coins
        return (
            <Pagination
                activePage={current_page}
                itemsCountPerPage={per_page}
                totalItemsCount={total}
                pageRangeDisplayed={5}
                onChange={(pageNumber) => getListOfCoins(pageNumber)}
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
            url: '/crypto-purchase',
            value: 'Market Cap',
        },
    ]
    const { colorMode} = useColorMode()
    const isDark = colorMode === 'dark'
    return coins === null ? (
            <Loader /> 
        ) : (
        <Stack>
            <BreadCrumb links={links} />
            <PrimaryCard>
                <Box overflow={'scroll'}>
                <Table variant='striped' colorScheme={isDark ? 'gray' : 'facebook'} boxShadow={'lg'}>
                    <TableCaption placement='top'>Marketcap</TableCaption>
                    <Thead>
                        <Tr>
                            {COINS_COLUMN.map((header_column, index) => <Th key={index}>{header_column.Header}</Th>)}
                        </Tr>
                    </Thead>
                    <Tbody>
                    {
                        coins.data.length ?
                        coins.data.map((each_coin, indexs) => (
                            <Tr key={indexs}>
                                <Td>{indexs + 1}</Td>
                                <Td>
                                    <Image src={each_coin.coin_logo} fallbackSrc='https://via.placeholder.com/500' alt={each_coin.coin_name} width={'35px'} height={'35px'} rounded={'full'} />
                                    {each_coin.coin_name}
                                </Td>
                                <Td>{formater.format(each_coin.currrent_price)}</Td>
                                <Td>{each_coin.percent_change_24h}%</Td>
                                <Td>{formater.format(each_coin.volume_change_24h)}</Td> 
                                <Td>{formater.format(each_coin.market_cap)}</Td> 
                                <Td>
                                    <Link to={'/process-crypto-purchase/'+each_coin.unique_id} >
                                        <Button rightIcon={<FiArrowRight/>} colorScheme={'teal'} variant={'solid'}>BUY</Button>
                                    </Link>
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

export default CryptoPurchase;
