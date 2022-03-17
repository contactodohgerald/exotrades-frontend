import { 
    SimpleGrid,
    useMediaQuery,
    useToast
 } from '@chakra-ui/react';
 import * as Yup from 'yup'
 import { Form, Formik } from 'formik';
 import React, { useEffect, useState } from 'react';
 import axios from "axios";
 import { BASE_URL } from '../api_routes';
import FormikControl from './FormikControl';
import Loader from './Loader';
import API_TOKEN from '../token';
import swal from 'sweetalert'

const gender_options = [
    {value: 'male', label: 'Male'},
    {value: 'female', label: 'Female'},
]
  
const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid Email Format').required('Required!'),
})

function BasicProfileEdit() {
    const [countries, setCountry] = useState([])
    const [userData, setUserData] = useState(false)

    const userValue = userData.payload

    const onSubmit = (values, {setErrors, resetForm}) => {
        axios.post(BASE_URL+`update-user-profile/${userValue.unique_id}`, values, {
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

    const getListOfCountries = () => {
        axios.get(BASE_URL+'get-country-list')
        .then(respond => {
            const countries = respond.data
            setCountry(countries)
        })
        .catch(error => {
            const errorMsg = error.message
            console.log('errorMsg', errorMsg)
        })
    }
    const editUserProfileDetails = () => {
        axios.get(BASE_URL+'get-user-profile', {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}` 
            }
        })
        .then(respond => {
            const users = respond.data
            setUserData(users)
        })
        .catch(error => {
            const errorMsg = error.message
            swal({
                title: "Error",
                text: errorMsg,
                icon: "error"
            })
        })
    }
    useEffect(() => {
        getListOfCountries()
        editUserProfileDetails()
    }, [])

    const initialValue = {
        name: userData ? userValue.name : '',
        email: userData ? userValue.email : '',
        gender: userData ? userValue.gender : '',
        country: userData ? userValue.country : '',
        phone: userData ? userValue.phone : '',
        referral: userData ? userValue.referral_id : '',
        address: userData ? userValue.address : '',
    }

    const country_options = 
        countries.payload !== undefined ?
        countries.payload.map(item => (
            {value: item.name, label: item.name}
        )) : []
    const [isNotSmallerScreen] = useMediaQuery('(min-width: 600px)')
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
    return !userData ? (
                <Loader /> 
            ) : (
        <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={onSubmit}>
        {
            formik => {
            return <Form>
                <SimpleGrid columns={isNotSmallerScreen ? 2 : 1} spacing={1}>
                    <FormikControl control='chakrainput' type='text' label='Full Name' name='name' />
                    <FormikControl control='chakrainput' type='email' label='Email' name='email' />
                    <FormikControl control='reactselect' label='Gender' name='gender' options={gender_options} />
                    <FormikControl control='reactselect'  label='Country' name='country' options={country_options} />
                    <FormikControl control='chakrainput' type='text' label='Phone Number' name='phone' />
                    <FormikControl control='chakrainput' type='text' label='Referral Code' name='referral' />
                </SimpleGrid>
                <FormikControl control='chakrainput' type='text' label='Address' name='address' />
                <FormikControl control='chakrabutton' type='submit' label='Update User Profile' disabled={!formik.isValid || formik.isSubmitting}/>
            </Form>
            }
        }
        </Formik>
    );
}

export default BasicProfileEdit;
