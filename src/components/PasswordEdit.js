import {
    useToast
 } from '@chakra-ui/react';
import * as Yup from 'yup'
import { Form, Formik } from 'formik';
import React from 'react';
import axios from "axios";
import { BASE_URL } from '../api_routes';
import FormikControl from './FormikControl';
import API_TOKEN from '../token';

const initialValue = {
    current_password: '',
    password: '',
    password_confirmation: '',
}
  
const validationSchema = Yup.object({
    current_password: Yup.string().required('Required!'),
    password: Yup.string().required('Required!'),
    password_confirmation: Yup.string()
        .oneOf([Yup.ref('password'), ''], 'Passwords Must Match')
        .required('Required!'),
})

function PasswordEdit() {
    const onSubmit = (values, {setErrors, resetForm}) => {
        axios.post(BASE_URL+'update-password', values, {
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
            bringOutToast(success)
            resetForm()
        })
        .catch(error => {
            const errorMsg = error.message
            bringOutToast(errorMsg, 'error')
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
                <FormikControl control='chakrainput' type='password' label='Current Password' name='current_password' />
                <FormikControl control='chakrainput' type='password' label='New Password' name='password' />
                <FormikControl control='chakrainput' type='password' label='Confrim Password' name='password_confirmation' />
                <FormikControl control='chakrabutton' type='submit' label='Update Settings' disabled={!formik.isValid || formik.isSubmitting}/>
            </Form>
            }
        }
        </Formik>
    );
}

export default PasswordEdit;
