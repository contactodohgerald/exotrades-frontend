import React from 'react'
import {
    FormControl,
    FormLabel,
    Switch,
} from '@chakra-ui/react'

function ChakraSwitch(props) {
    const { label, name, ...rest } = props 
    return (
        <FormControl pt='8' display='flex' alignItems='center'>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <Switch name={name} id={name} {...rest} colorScheme='facebook' size='md'/>
        </FormControl>
    )
}

export default ChakraSwitch
