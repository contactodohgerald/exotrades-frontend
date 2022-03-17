import React from 'react';
import * as Yup from 'yup'
import { Form, Formik } from 'formik';
import FormikControl from './FormikControl';
import axios from "axios";
import { BASE_URL } from '../api_routes';
import API_TOKEN from '../token';
import swal from 'sweetalert'
import { Input, useToast } from '@chakra-ui/react';

const initialValue = {
    thumbnail: null,
}
  
const validationSchema = Yup.object({
    thumbnail: Yup.string().required('Required'),
})

function UploadPaymentProof(props) {
    const { trans_id } = props

    const onSubmit = (values, {resetForm}) => {
        let formData = new FormData()

        formData.append("thumbnail", values.thumbnail)
        axios.post(BASE_URL+`upload-payment-proof/${trans_id}`, values, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
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
            bringOutToast(success)
            resetForm()
            return;
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
    const toast = useToast()
    const bringOutToast = (msg, status='success') => {
        toast({
            title: msg,
            variant: 'top-accent',
            position: 'top-right',
            status: status,
            isClosable: true,
        })
    }
    return (
        <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={onSubmit}>
        {
            formik => {
            return <Form>
                <Input type='file' name='thumbnail' onChange={(event) => { 
                    formik.setFieldValue("thumbnail", event.currentTarget.files[0])
                }} />
                <FormikControl control='chakrabutton' type='submit' label='Upload Payment' disabled={!formik.isValid || formik.isSubmitting}/>
            </Form>
            }
        }
        </Formik>     
    );
}

export default UploadPaymentProof;
