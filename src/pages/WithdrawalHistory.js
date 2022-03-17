import { 
    Badge, 
    Box,
    IconButton,
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
    useDisclosure
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup'
import axios from "axios";
import { BASE_URL } from '../api_routes';
import API_TOKEN from '../token';
import BreadCrumb from '../components/BreadCrumb';
import { FaHamburger } from 'react-icons/fa';
import PrimaryCard from '../components/PrimaryCard';
import Loader from '../components/Loader';
import { WITHDRAW_COLUMN } from '../table_columns/withdrawal_column';
import Pagination from 'react-js-pagination';
import { formater } from '../_formater';
import Moment from 'react-moment';
import { Field, Form, Formik } from 'formik';
import FormikControl from '../components/FormikControl';
import swal from 'sweetalert'
import 'bootstrap/dist/css/bootstrap.min.css'
  
const validationSchema = Yup.object({
})

function WithdrawalHistory() {
    const [withdrawals, setWithdrawal] = useState(null)
    const [uniqueid, setUniqueid] = useState('')
    const { isOpen, onOpen, onClose } = useDisclosure()

    const initialValue = {
        uniqueIdToProcess: uniqueid,
    }

    const onSubmit = async (values, {resetForm}) => {
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
             getListOfWithdrawal(withdrawals.current_page)
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

    const getListOfWithdrawal = (pageNumber = 1) => {
        axios.get(BASE_URL+`get-users-withdrawal?page=${pageNumber}`, {
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
        getListOfWithdrawal()
    }, [])

    const PaginateBody = () => {
        const {current_page, per_page, total } = withdrawals
        return (
            <Pagination
                activePage={current_page}
                itemsCountPerPage={per_page}
                totalItemsCount={total}
                pageRangeDisplayed={5}
                onChange={(pageNumber) => getListOfWithdrawal(pageNumber)}
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
    return withdrawals === null ? (
            <Loader /> 
        ) : (
        <Stack>
            <BreadCrumb links={links} />
            <PrimaryCard>
                <Box overflow={'scroll'}>
                <Table variant='striped' colorScheme={isDark ? 'gray' : 'facebook'} boxShadow={'lg'}>
                    <TableCaption placement='top'>Withdrawal History</TableCaption>
                    <Thead>
                        <Tr>
                            {WITHDRAW_COLUMN.map((header_column, index) => <Th key={index}>{header_column.Header}</Th>)}
                        </Tr>
                    </Thead>
                    <Tbody>
                    {
                        withdrawals.length !== 0 ?
                        withdrawals.data.map((each_withdraw, indexs) => (
                           <>
                            <Tr key={indexs}>
                                <Td>{indexs + 1}</Td>
                                <Td>{formater.format(each_withdraw.amount)}</Td>
                                <Td>
                                    <Badge variant={'outline'} colorScheme={each_withdraw.status === 'pending' ? 'red' : 'green'}>{each_withdraw.status}</Badge>
                                </Td>
                                <Td>{each_withdraw.user_wallet.system_wallet.wallet_name}</Td>
                                <Td>
                                    <Moment format="DD/MM/YYYY">{each_withdraw.created_at}</Moment>
                                </Td>
                                <Td>
                                    <Button as={IconButton} icon={<FaHamburger />} onClick={() => bringoutDeleteModal(`${each_withdraw.unique_id }`)} variant='outline'/>
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
                        <ModalHeader fontSize='lg' fontWeight='bold'>Delete Withdraw</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                        <Box>
                            <Text>Do you really want to delete this withdraw ?</Text>
                            <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={onSubmit}>
                            {
                                formik => {
                                    return <Form>
                                        <Field type='hidden' name='uniqueIdToProcess'  />
                                        <FormikControl control='chakrabutton' type='submit' label='Delete Withdrawal' disabled={!formik.isValid || formik.isSubmitting}/>
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

export default WithdrawalHistory;
