import { 
    Container,
    Stack,
} from '@chakra-ui/react'
import * as Yup from 'yup'
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { BASE_URL } from '../api_routes';
import API_TOKEN from '../token';
import BreadCrumb from '../components/BreadCrumb'
import PrimaryCard from '../components/PrimaryCard'
import Loader from '../components/Loader';
import swal from 'sweetalert'
import FormikControl from '../components/FormikControl';
import { useNavigate, useParams } from 'react-router-dom';

const admin_status = [
    {value: 'no', label: 'No'},
    {value: 'yes', label: 'Yes'},
]
  
const validationSchema = Yup.object({
    wallet_name: Yup.string().required('Required'),
    wallet_address: Yup.string().required('Required'),
    admin_only: Yup.string().required('Please Select A Value'), 
})

function EditSystemWallet() {
    const params = useParams()
    const navigate = useNavigate()
    const [wallet, setUserWallet] = useState(false)

    const onSubmit = (values, {resetForm}) => {
        axios.post(BASE_URL+`update-system-wallet/${params.unique_id}`, values, {
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
            navigate('/view-system-wallet', {replace: true})
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

    const getListOfSystemWallets = () => {
        axios.get(BASE_URL+`get-single-system-wallet/${params.unique_id}`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}` 
            }
        })
        .then(respond => {console.log('respond', respond)
            const wallets = respond.data.payload
            setUserWallet(wallets)
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
        getListOfSystemWallets()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const initialValue = {
        wallet_name: wallet ? wallet.wallet_name : '',
        wallet_address: wallet ? wallet.wallet_address : '',
        admin_only: wallet ? wallet.admin_only : '',
        thumbnail: '',
        current_value: wallet ? wallet.current_value : '',
    }

    const links = [
        {
            url: '/admin-dashboard',
            value: 'Dashboard',
        },
        {
            url: '/view-system-wallet',
            value: 'Wallet List',
        }, 
        {
            url: '#',
            value: 'Edit Wallet',
        },
    ]
  return !wallet ? (
            <Loader />
        ) : (
      <Stack>
          <BreadCrumb links={links} />
          <PrimaryCard>
              <Container>
                <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {
                        formik => {
                        return <Form>
                            <FormikControl control='chakrainput' type='text' label='Wallet Name' name='wallet_name' />
                            <FormikControl control='chakrainput' type='text' label='Wallet Address' name='wallet_address' />
                            <FormikControl control='reactselect' label='Admin Only' name='admin_only' options={admin_status} />
                            <FormikControl control='chakrainput' type='file' label='Wallet Image' name='thumbnail' />
                            <FormikControl control='chakrainput' type='text' label='Current Value' name='current_value' />
                            <FormikControl control='chakrabutton' type='submit' label='Edit Wallet' disabled={!formik.isValid || formik.isSubmitting}/>
                        </Form>
                        }
                    }
                </Formik>
              </Container>
          </PrimaryCard>
      </Stack>
  )
}

export default EditSystemWallet