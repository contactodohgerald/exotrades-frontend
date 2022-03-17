import { 
    Container,
    Stack 
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

const initialValue = {
    wallet_addresse_id: '',
    wallet_address: '',
}
  
const validationSchema = Yup.object({
    wallet_addresse_id: Yup.string().required('Please Select A Value'),
    wallet_address: Yup.string().required('Required'),
})

const onSubmit = (values, {resetForm}) => {
    axios.post(BASE_URL+'add-user-wallet', values, {
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

function WalletSetup() {
    const [systemWallet, setsystemWallet] = useState([])

    const getListOfSystemWallets = () => {
        axios.get(BASE_URL+'get-list-of-system-wallet', {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}` 
            }
        })
        .then(respond => {
            const wallets = respond.data.payload.data
            setsystemWallet(wallets)
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
    }, [])

    const system_wallets =
    systemWallet !== undefined ?
    systemWallet.map(item => (
            {value: item.unique_id, label: item.wallet_name}
        )) : []

    const links = [
        {
            url: '/dashboard',
            value: 'Dashboard',
        },
        {
            url: '#',
            value: 'Add Wallet',
        },
    ]
  return systemWallet === undefined ? (
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
                            <FormikControl control='reactselect' label='Wallet Type' name='wallet_addresse_id' options={system_wallets} />
                            <FormikControl control='chakrainput' type='text' label='Wallet Address' name='wallet_address' />
                            <FormikControl control='chakrabutton' type='submit' label='Add New Wallet' disabled={!formik.isValid || formik.isSubmitting}/>
                        </Form>
                        }
                    }
                </Formik>
              </Container>
          </PrimaryCard>
      </Stack>
  )
}

export default WalletSetup