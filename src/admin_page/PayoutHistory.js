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
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { BASE_URL } from '../api_routes';
import API_TOKEN from '../token';
import BreadCrumb from '../components/BreadCrumb';
import PrimaryCard from '../components/PrimaryCard';
import Loader from '../components/Loader';
import Pagination from 'react-js-pagination';
import { formater } from '../_formater';
import swal from 'sweetalert'
import Moment from 'react-moment';
import { Field, Form, Formik } from 'formik';
import FormikControl from '../components/FormikControl';
import * as Yup from 'yup'
import 'bootstrap/dist/css/bootstrap.min.css'

const validationSchema = Yup.object({
})

function PayoutHistory() {
    const [withdrawals, setWithdrawal] = useState(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [uniqueid, setUniqueid] = useState('')

    const getListOfWithdrawals = (pageNumber = 1) => {
        axios.get(BASE_URL+`get-confirm-withdrawals?page=${pageNumber}`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}` 
            }
        })
        .then(respond => {
            const withdraw = respond.data.payload
            setWithdrawal(withdraw)
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
        getListOfWithdrawals()
    }, [])

    const initialValue = {
        uniqueIdToProcess: uniqueid,
    }

    const PaginateBody = () => {
        const {current_page, per_page, total} = withdrawals
        return (
            <Pagination
                activePage={current_page}
                itemsCountPerPage={per_page}
                totalItemsCount={total}
                pageRangeDisplayed={5}
                onChange={(pageNumber) => getListOfWithdrawals(pageNumber)}
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
    const deleteUserPayment = async (values, {resetForm}) => {
        await axios.post(BASE_URL+'delete-withdrawal', values, {
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
             getListOfWithdrawals(withdrawals.current_page)
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
 
    const links = [
        {
            url: '/admin-dashboard',
            value: 'Dashboard',
        },
        {
            url: '#',
            value: 'Payment History',
        },
    ]
    const { colorMode} = useColorMode()
    const isDark = colorMode === 'dark'
    return withdrawals === null ? (
            <Loader /> 
        ) : (
        <Stack>
            <BreadCrumb links={links} />
            <PrimaryCard>
                <Box overflow={'scroll'}>
                <Table variant='striped' colorScheme={isDark ? 'gray' : 'facebook'} boxShadow={'lg'}>
                    <TableCaption placement='top'>Payment History</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>S/N</Th>
                            <Th>User Email</Th>
                            <Th>Amount ($)</Th>
                            <Th>Status</Th>
                            <Th>Wallet Type</Th>
                            <Th>Settlement Status</Th>
                            <Th>Date</Th>
                            <Th>Delete</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                    {
                        withdrawals.data.length ?
                        withdrawals.data.map((each_withdraw, indexs) => (
                            <Tr key={indexs}>
                                <Td>{indexs + 1}</Td>
                                <Td>{each_withdraw.users === null ? '' : each_withdraw.users.email}</Td>
                                <Td>{formater.format(each_withdraw.amount)}</Td>
                                <Td>
                                    <Badge variant={'outline'} colorScheme={each_withdraw.status === 'pending' ? 'red' : 'green'}>{each_withdraw.status}</Badge>
                                </Td>
                                <Td>{each_withdraw.user_wallet.system_wallet.wallet_name}</Td>
                                <Td>
                                    <Badge variant={'solid'} colorScheme={each_withdraw.remove_status === 'no' ? 'orange' : 'blue'}>{each_withdraw.remove_status === 'no' ? 'Processing' : 'Settled'}</Badge>
                                </Td>
                                <Td>
                                    <Moment format="DD/MM/YYYY">{each_withdraw.created_at}</Moment>
                                </Td>
                                <Td>
                                    <Button variant={'outline'} colorScheme={'red'} onClick={() => bringoutDeleteModal(`${each_withdraw.unique_id }`)}>Delete</Button>
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
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalOverlay>
                    <ModalContent>
                        <ModalHeader fontSize='lg' fontWeight='bold'>Delete Withdrawal</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                        <Box>
                            <Text>Are you sure you want to delete this user's withdrawal?</Text>
                            <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={deleteUserPayment}>
                            {
                                formik => {
                                    return <Form>
                                        <Field type='hidden' name='uniqueIdToProcess'  />
                                        <FormikControl control='chakrabutton' type='submit' label='Proceed' disabled={!formik.isValid || formik.isSubmitting}/>
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

export default PayoutHistory;
