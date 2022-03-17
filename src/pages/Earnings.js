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
    Alert
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup'
import axios from "axios";
import { BASE_URL } from '../api_routes';
import API_TOKEN from '../token';
import BreadCrumb from '../components/BreadCrumb';
import PrimaryCard from '../components/PrimaryCard';
import Loader from '../components/Loader';
import Pagination from 'react-js-pagination';
import { formater } from '../_formater';
import Moment from 'react-moment';
import { Field, Form, Formik } from 'formik';
import FormikControl from '../components/FormikControl';
import swal from 'sweetalert'
import 'bootstrap/dist/css/bootstrap.min.css'
  
const validationSchema = Yup.object({
})

function Earnings() {
    const [earnings, setEarnings] = useState(null)
    const [siteDetails, setSiteDetails] = useState(null)
    const [uniqueid, setUniqueid] = useState('')
    const [variable, setVariable] = useState({title: '', description: '', extra: '', submit: ''})
    const { isOpen, onOpen, onClose } = useDisclosure()

    const initialValue = {
        transId: uniqueid,
    }

    const getListOfEarnings = (pageNumber = 1) => {
        axios.get(BASE_URL+`earnings-page?page=${pageNumber}`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}` 
            }
        })
        .then(respond => {
            const earning = respond.data
            setEarnings(earning.payload)
            setSiteDetails(earning.site_details)
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
        getListOfEarnings()
    }, [])

    const PaginateBody = () => {
        const {current_page, per_page, total } = earnings
        return (
            <Pagination
                activePage={current_page}
                itemsCountPerPage={per_page}
                totalItemsCount={total}
                pageRangeDisplayed={5}
                onChange={(pageNumber) => getListOfEarnings(pageNumber)}
                prevPageText='Prev'
                nextPageText='Next'
                itemClass='page-item'
                linkClass='page-link'
            />
        )
    }

    const bringoutReinvestModal = (unique_id) => {
        setVariable({title: 'Reinvest Earning', description: 'This means that you are adding the amount to your capital by increasing your ROI', submit: processEarningReinvest})
        setUniqueid(unique_id)
        onOpen()
    }

    const bringoutPayouttModal = (unique_id) => {
        setVariable({title: 'Transfer Funds', description: 'Transfer this earnings to your main wallet balance', extra: <Alert status='success' variant='subtle' mt={'5'}><Text>Note! A service charge of {siteDetails ? siteDetails.min_amount_to_transfer : 0}% will be deducted for every capital payout</Text></Alert>, submit:processEarningPayout})
        setUniqueid(unique_id)
        onOpen()
    }

    const processEarningReinvest = async (values, {resetForm}) => {
        await axios.post(BASE_URL+'process-earning-reinvest', values, {
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
             getListOfEarnings(earnings.current_page)
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
    const processEarningPayout = async (values, {resetForm}) => {
        await axios.post(BASE_URL+'process-earning-payout', values, {
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
             getListOfEarnings(earnings.current_page)
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
            url: '/dashboard',
            value: 'Dashboard',
        },
        {
            url: '#',
            value: 'View Earnings',
        },
    ]
    const { colorMode} = useColorMode()
    const isDark = colorMode === 'dark'
    return earnings === null ? (
            <Loader /> 
        ) : (
        <Stack>
            <BreadCrumb links={links} />
            <PrimaryCard>
                <Box overflowX={'scroll'}>
                <Table variant='striped' colorScheme={isDark ? 'gray' : 'facebook'} boxShadow={'lg'}>
                    <TableCaption placement='top'>View Earnings</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>S/N</Th>
                            <Th>Plan Name</Th>
                            <Th>Amount ($)</Th>
                            <Th>Type</Th>
                            <Th>Status</Th>
                            <Th>Reinvest</Th>
                            <Th>Payout</Th>
                            <Th>Date</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                    {
                        earnings.data.length !== 0 ?
                        earnings.data.map((each_earning, indexs) => (
                            <Tr key={each_earning.id}>
                                <Td>{indexs + 1}</Td>
                                <Td>{each_earning.transactions.plans.plan_name}</Td>
                                <Td>{formater.format(each_earning.amount)}</Td>
                                <Td>{each_earning.earning_type === 'interest_payout' ? 'Interest' : 'Capital'}</Td>
                                <Td>
                                    <Badge variant={'outline'} colorScheme={each_earning.status === 'pending' ? 'red' : 'green'}>{each_earning.status}</Badge>
                                </Td>
                                <Td>
                                    <Button colorScheme={'teal'} onClick={() => bringoutReinvestModal(`${each_earning.unique_id }`)} variant='outline'>Reinvest</Button>
                                </Td>
                                <Td>
                                    <Button colorScheme={'teal'} onClick={() => bringoutPayouttModal(`${each_earning.unique_id }`)} variant='solid'>Payout</Button>
                                </Td>
                                <Td>
                                    <Moment format="DD/MM/YYYY">{each_earning.created_at}</Moment>
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
                        <ModalHeader fontSize='lg' fontWeight='bold'>{variable.title}</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                        <Box>
                            <Text>{variable.description}</Text>
                            {variable.extra}
                            <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={variable.submit}>
                            {
                                formik => {
                                    return <Form>
                                        <Field type='hidden' name='transId'  />
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

export default Earnings;
