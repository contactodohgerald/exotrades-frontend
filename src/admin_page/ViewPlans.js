import { 
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
    useDisclosure
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { BASE_URL } from '../api_routes';
import API_TOKEN from '../token';
import BreadCrumb from '../components/BreadCrumb';
import PrimaryCard from '../components/PrimaryCard';
import Loader from '../components/Loader';
import { formater } from '../_formater';
import swal from 'sweetalert'
import { Field, Form, Formik } from 'formik';
import FormikControl from '../components/FormikControl';
import * as Yup from 'yup'
import { Link } from 'react-router-dom';

const validationSchema = Yup.object({
})

function ViewPlans() {
    const [plans, setPlans] = useState([])
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [uniqueid, setUniqueid] = useState('')

    const getListOfPlans = () => {
        axios.get(BASE_URL+'get-list-of-plans', {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}` 
            }
        })
        .then(respond => {
            const plan = respond.data.payload
            setPlans(plan)
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
        getListOfPlans()
    }, [])

    const initialValue = {
        uniqueIdToProcess: uniqueid,
    }

    const bringoutDeleteModal = (unique_id) => {
        setUniqueid(unique_id)
        onOpen()
    }
    const onSubmit = async (values, {resetForm}) => {
        await axios.post(BASE_URL+'delete-investment-plan', values, {
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
             getListOfPlans()
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
            value: 'View Plans',
        },
    ]
    const { colorMode} = useColorMode()
    const isDark = colorMode === 'dark'
    return plans.length === 0 ? (
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
                            <Th>S/N</Th>
                            <Th>Plan Name</Th>
                            <Th>Percentage (%)</Th>
                            <Th>Min Amount ($)</Th>
                            <Th>Max Amount ($)</Th>
                            <Th>Payment Interval</Th>
                            <Th>Interest Duration</Th>
                            <Th>Capital Duration</Th>
                            <Th>Edit</Th>
                            <Th>Delete</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                    {
                        plans.length ?
                        plans.map((each_plan, indexs) => (
                            <Tr key={indexs}>
                                <Td>{indexs + 1}</Td>
                                <Td>{each_plan.plan_name}</Td>
                                <Td>{each_plan.plan_percentage}</Td>
                                <Td>{formater.format(each_plan.min_amount)}</Td>
                                <Td>{each_plan.max_amount === 'Unlimited' ? 'Unlimited' : formater.format(each_plan.max_amount)}</Td>
                                <Td>{each_plan.payment_interval}</Td>
                                <Td>{each_plan.intrest_duration} Day(s)</Td>
                                <Td>{each_plan.capital_duration} Day(s)</Td>
                                <Td>
                                    <Link to={'/edit-plan/'+each_plan.unique_id}><Button variant={'solid'} colorScheme={'orange'}>Edit</Button></Link>
                                </Td>                               
                                <Td>
                                    <Button variant={'outline'} colorScheme={'red'} onClick={() => bringoutDeleteModal(`${each_plan.unique_id }`)}>Delete</Button>
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
            </PrimaryCard>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalOverlay>
                    <ModalContent>
                        <ModalHeader fontSize='lg' fontWeight='bold'>Delete Plan</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                        <Box>
                            <Text>Are you sure you want to delete this investment plan?</Text>
                            <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={onSubmit}>
                            {
                                formik => {
                                    return <Form>
                                        <Field type='hidden' name='uniqueIdToProcess'  />
                                        <FormikControl control='chakrabutton' type='submit' label='Delete Plan' disabled={!formik.isValid || formik.isSubmitting}/>
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

export default ViewPlans;
