import { 
    Container,
    Stack, 
    Text
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
  
const validationSchema = Yup.object({
    wallet_address: Yup.string().required('Required'),
})

function EditUserWallet() {
    const params = useParams()
    const navigate = useNavigate()
    const [wallet, setUserWallet] = useState(false)

    const onSubmit = (values, {resetForm}) => {
        axios.post(BASE_URL+`update-user-wallet/${params.unique_id}`, values, {
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
            navigate('/view-wallets', {replace: true})
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
        axios.get(BASE_URL+`get-single-user-wallet/${params.unique_id}`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}` 
            }
        })
        .then(respond => {
            const wallets = respond.data.payload.data
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
        wallet_address: wallet ? wallet.wallet_address : '',
    }

    const links = [
        {
            url: '/dashboard',
            value: 'Dashboard',
        },
        {
            url: '/view-wallets',
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
                            <Text textAlign={'center'}>Wallet Type</Text>
                            <Text textAlign={'center'} fontWeight={'bold'} fontSize={'3xl'}>{wallet.system_wallet.wallet_name}</Text>
                            <FormikControl control='chakrainput' type='text' label='Wallet Address' name='wallet_address' />
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

export default EditUserWallet