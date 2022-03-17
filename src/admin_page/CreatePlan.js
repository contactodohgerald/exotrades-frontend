import { 
    SimpleGrid,
    Stack,
    useMediaQuery
 } from '@chakra-ui/react';
 import * as Yup from 'yup'
 import { Form, Formik } from 'formik';
 import React from 'react';
 import axios from "axios";
 import { BASE_URL } from '../api_routes';
import FormikControl from '../components/FormikControl'
import API_TOKEN from '../token';
import swal from 'sweetalert'
import BreadCrumb from '../components/BreadCrumb';
import PrimaryCard from '../components/PrimaryCard';

const initialValue = {
    plan_name: '',
    plan_percentage: '',
    min_amount: '',
    max_amount: '',
    intrest_duration: '',
    capital_duration: '',
    payment_interval: '',
    thumbnail: '',
}
  
const validationSchema = Yup.object({
    plan_name: Yup.string().required('Required'),
    plan_percentage: Yup.string().required('Required'),
    min_amount: Yup.string().required('Required'),
    max_amount: Yup.string().required('Required'),
    intrest_duration: Yup.string().required('Required'),
    capital_duration: Yup.string().required('Required'),
})

function CreatePlan() {

    const onSubmit = (values, {setErrors, resetForm}) => {
        axios.post(BASE_URL+'add-investment-plan', values, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}` 
            }
        })
        .then(respond => {
            const res = respond.data
            if(res.status === false){
                const error = res.error.message
                setErrors(error)
                return;
            }
            const success = res.success.message
            swal({
                title: "Success",
                text: success,
                icon: "success"
            })
            resetForm()
        })
        .catch(error => {
            const errorMsg = error.message
            console.log('errorMsg', errorMsg)
            return
        })
    }

    const [isNotSmallerScreen] = useMediaQuery('(min-width: 600px)')
    const links = [
        {
            url: '/admin-dashboard',
            value: 'Dashboard',
        },
        {
            url: '#',
            value: 'Create New Plan',
        },
    ]
    return (
       <Stack>
           <BreadCrumb links={links} />
           <PrimaryCard>
                <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {
                        formik => {
                        return <Form>
                            <SimpleGrid columns={isNotSmallerScreen ? 2 : 1} spacing={1}>
                                <FormikControl control='chakrainput' type='text' label='Plan Name' name='plan_name' />
                                <FormikControl control='chakrainput' type='text' label='Plan Percentage' name='plan_percentage' />
                                <FormikControl control='chakrainput' type='number' label='Min Amount ($)' name='min_amount' />
                                <FormikControl control='chakrainput' type='number' label='Max Amount ($)' name='max_amount' />
                                <FormikControl control='chakrainput' type='text' label='Intrest Duration (Days)' name='intrest_duration' />
                                <FormikControl control='chakrainput' type='text' label='Capital Duration (Days)' name='capital_duration' />
                                <FormikControl control='chakrainput' type='text' label='Payment Interval (Daily, Weelky, Yearly)' name='payment_interval' />
                                <FormikControl control='chakrainput' type='file' label='Plan Image (Optional)' name='thumbnail' />
                            </SimpleGrid>
                            <FormikControl control='chakrabutton' type='submit' label='Create New Plan' disabled={!formik.isValid || formik.isSubmitting}/>
                        </Form>
                        }
                    }
                </Formik>
           </PrimaryCard>
       </Stack>
    );
}

export default CreatePlan;
