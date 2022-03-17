import { 
    Badge, 
    Box,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
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
    useDisclosure,
    Image
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup'
import axios from "axios";
import { BASE_URL } from '../api_routes';
import API_TOKEN from '../token';
import BreadCrumb from '../components/BreadCrumb';
import PrimaryCard from '../components/PrimaryCard';
import Loader from '../components/Loader';
import { CRYPTO_COLUMN } from '../table_columns/crypto_purchased_column';
import Pagination from 'react-js-pagination';
import { formater } from '../_formater';
import Moment from 'react-moment';
import { Field, Form, Formik } from 'formik';
import FormikControl from '../components/FormikControl';
import swal from 'sweetalert'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link } from 'react-router-dom';
  
const validationSchema = Yup.object({
})

function PurchasedCryptoHistory() {
    const [dataHold, setDataHold] = useState(null)
    const [uniqueid, setUniqueid] = useState('')
    const { isOpen, onOpen, onClose } = useDisclosure()

    const initialValue = {
        uniqueIdToProcess: uniqueid,
    }

    const onSubmit = async (values, {resetForm}) => {
        await axios.post(BASE_URL+'delete-purchase', values, {
             headers: {
                 'Authorization': `Bearer ${API_TOKEN}` 
             }
         })
         .then(respond => {
             const res = respond.data
             if(res.status === false){
                 const error = res.error.message
                 swal({
                     title: "Error",
                     text: error,
                     icon: "error"
                 })
                 resetForm()
                 return;
             }
             const success = res.success.message
             swal({
                 title: "Success",
                 text: success,
                 icon: "success"
             })
             getListOfPurchasedCrypto(dataHold.current_page)
             onClose()
             return
         })
         .catch(error => {
             const errorMsg = error.message
             swal({
                 title: "Error",
                 text: errorMsg,
                 icon: "error"
             })
             onClose()
             return
         })
    }

    const getListOfPurchasedCrypto = (pageNumber = 1) => {
        axios.get(BASE_URL+`crypto-purchase-history?page=${pageNumber}`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}` 
            }
        })
        .then(respond => {
            const data = respond.data.payload
            setDataHold(data)
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
        getListOfPurchasedCrypto()
    }, [])

    const PaginateBody = () => {
        const {current_page, per_page, total } = dataHold
        return (
            <Pagination
                activePage={current_page}
                itemsCountPerPage={per_page}
                totalItemsCount={total}
                pageRangeDisplayed={5}
                onChange={(pageNumber) => getListOfPurchasedCrypto(pageNumber)}
                prevPageText='Prev'
                nextPageText='Next'
                itemClass='page-item'
                linkClass='page-link'
            />
        )
    }

    const bringoutDeleteModal = (unique_id) => {
        setUniqueid(unique_id)
        onOpen()
    }
  
    const links = [
        {
            url: '/dashboard',
            value: 'Dashboard',
        },
        {
            url: '/withdrawal-history',
            value: 'Withdrawal History',
        },
    ]
    const { colorMode} = useColorMode()
    const isDark = colorMode === 'dark'
    return dataHold === null ? (
            <Loader /> 
        ) : (
        <Stack>
            <BreadCrumb links={links} />
            <PrimaryCard>
                <Box overflow={'scroll'}>
                <Table variant='striped' colorScheme={isDark ? 'gray' : 'facebook'} boxShadow={'lg'}>
                    <TableCaption placement='top'>Crypto Purchase History</TableCaption>
                    <Thead>
                        <Tr>
                            {CRYPTO_COLUMN.map((header_column, index) => <Th key={index}>{header_column.Header}</Th>)}
                        </Tr>
                    </Thead>
                    <Tbody>
                    {
                        dataHold.length !== 0 ?
                        dataHold.data.map((each_data, indexs) => (
                           <>
                            <Tr key={indexs}>
                                <Td>{indexs + 1}</Td>
                                <Td>
                                    <Image src={each_data.coin_details.coin_logo} fallbackSrc='https://via.placeholder.com/500' alt={each_data.coin_details.coin_name} width={'35px'} height={'35px'} rounded={'full'} />
                                    {each_data.coin_details.coin_name}
                                </Td>
                                <Td>{each_data.day_counter}</Td>
                                <Td>{formater.format(each_data.amount_to_pay / each_data.coin_details.currrent_price)}</Td>
                                <Td>{each_data.system_wallet.wallet_name}</Td>
                                <Td>{formater.format(each_data.amount_to_pay)}</Td>
                                <Td>
                                    <Badge variant={'outline'} colorScheme={each_data.received_status === 'pending' ? 'red' : 'green'}>{each_data.received_status}</Badge>
                                </Td>
                                <Td>
                                    <Moment format="DD/MM/YYYY">{each_data.created_at}</Moment>
                                </Td>
                                <Td>
                                    <Button colorScheme={'teal'} onClick={() => bringoutDeleteModal(`${each_data.unique_id }`)} variant='outline'>DELETE</Button>
                                </Td>
                                <Td>
                                    <Link to={'/crypto-purchase-inovice/'+each_data.unique_id}>
                                        <Button colorScheme={'teal'} variant={'solid'}>EDIT</Button>
                                    </Link>
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
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalOverlay>
                    <ModalContent>
                        <ModalHeader fontSize='lg' fontWeight='bold'>Delete Transaction</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                        <Box>
                            <Text>Do you really want to delete this transaction ?</Text>
                            <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={onSubmit}>
                            {
                                formik => {
                                    return <Form>
                                        <Field type='hidden' name='uniqueIdToProcess'  />
                                        <FormikControl control='chakrabutton' type='submit' label='Delete Transaction' disabled={!formik.isValid || formik.isSubmitting}/>
                                    </Form>
                                }
                            }
                            </Formik>
                        </Box>
                        </ModalBody>
                    </ModalContent>
                </ModalOverlay>
            </Modal>
        </Stack>
    );
}

export default PurchasedCryptoHistory;
