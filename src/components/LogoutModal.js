import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Button,
    useToast,
    ModalFooter,
    Text
} from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { BASE_URL } from "../api_routes";
import API_TOKEN from '../token';


function LogoutModal(props) {
    const { isOpen, onClose, } = props
    const navigate = useNavigate()  
    const logout = () => {
        axios.post(BASE_URL+'logout', null, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}` 
            }
        })
        .then(respond => {
            const res = respond.data
            if(res.status === false){
                const error = res.error.message
                bringOutToast(error, 'error')
                return;
            }
            const success = res.success.message
            bringOutToast(success)
            localStorage.removeItem("user_token")
            navigate('/', {replace: true})
        })
        .catch(error => {
            const errorMsg = error.message
            bringOutToast(errorMsg, 'error')
            return
        })
        onClose()
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalOverlay>
            <ModalContent>
                <ModalHeader fontSize='lg' fontWeight='bold'>Logout</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                  <Text>Do you really want to logout?</Text>
                </ModalBody>
                <ModalFooter>
                  <Button onClick={onClose}>Cancel</Button>
                  <Button colorScheme='red' ml={3} onClick={logout}>Logout</Button>
                </ModalFooter>
            </ModalContent>
        </ModalOverlay>
      </Modal>
    )
}

export default LogoutModal;