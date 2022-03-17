import { 
    SimpleGrid,
    Stack,
    useMediaQuery
 } from '@chakra-ui/react';
 import * as Yup from 'yup'
 import { Form, Formik } from 'formik';
 import React, { useEffect, useState } from 'react';
 import axios from "axios";
 import { BASE_URL } from '../api_routes';
import FormikControl from '../components/FormikControl'
import API_TOKEN from '../token';
import swal from 'sweetalert'
import BreadCrumb from '../components/BreadCrumb';
import PrimaryCard from '../components/PrimaryCard';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
  
const validationSchema = Yup.object({
    plan_name: Yup.string().required('Required'),
    plan_percentage: Yup.string().required('Required'),
    min_amount: Yup.string().required('Required'),
    max_amount: Yup.string().required('Required'),
    intrest_duration: Yup.string().required('Required'),
    capital_duration: Yup.string().required('Required'),
})

function EditPlan() {
    const params = useParams()
    const [plan, setPlan] = useState(false)

    const onSubmit = (values, {setErrors, resetForm}) => {
        axios.post(BASE_URL+`update-plan/${params.unique_id}`, values, {
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

    const getSinglePlan = () => {
        axios.get(BASE_URL+`get-single-plan/${params.unique_id}`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}` 
            }
        })
        .then(respond => {
            const data = respond.data.payload
            setPlan(data)
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
        getSinglePlan()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const initialValue = {
        plan_name: plan.plan_name,
        plan_percentage: plan.plan_percentage,
        min_amount: plan.min_amount,
        max_amount: plan.max_amount,
        intrest_duration: plan.intrest_duration,
        capital_duration: plan.capital_duration,
        payment_interval: plan.payment_interval,
        thumbnail: '',
    }

    const [isNotSmallerScreen] = useMediaQuery('(min-width: 600px)')
    const links = [
        {
            url: '/admin-dashboard',
            value: 'Dashboard',
        },
        {
            url: '/view-plan',
            value: 'View Plans',
        }, 
        {
            url: '#',
            value: 'Edit Plan',
        },
    ]
    return !plan ? ( <Loader/> ) : (
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
                            <FormikControl control='chakrabutton' type='submit' label='Update Plan' disabled={!formik.isValid || formik.isSubmitting}/>
                        </Form>
                        }
                    }
                </Formik>
           </PrimaryCard>
       </Stack>
    );
}

export default EditPlan;
