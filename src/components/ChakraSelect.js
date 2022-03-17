import React from 'react'
import { Field } from 'formik'
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    Select,
} from '@chakra-ui/react'

function ChakraSelect(props) {
    const {current_value, label, options, name, ...rest } = props
    return (
        <Field name={name}>
            {
                ({form, field}) => {
                    return <FormControl name={name} pt='8' isInvalid={form.errors[name] && form.touched[name]}>
                        <FormLabel htmlFor={name}>{label}</FormLabel>
                        <Select name={name} id={name} {...rest} placeholder='Select option' onChange={field.onChange} value={current_value}>
                            {options.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.key}
                                </option>
                            )
                            )}
                        </Select>
                        <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
                    </FormControl>
                }
            }
        </Field>
    )
}

export default ChakraSelect
