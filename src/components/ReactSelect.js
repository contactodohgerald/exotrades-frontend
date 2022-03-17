import { FormControl, FormLabel } from '@chakra-ui/react'
import { ErrorMessage, useField } from 'formik'
import React from 'react'
import Select from 'react-select'

function ReactSelect(props) {
    const {options, label, name, ...rest } = props
    const [field, meta, helpers] = useField(name)
  return (
        <FormControl pt='8'>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <Select 
            name={name} 
            value={field.value['value']} 
            onChange={(value) => helpers.setValue(value['value'])} 
            options={options} 
            onBlur={() => helpers.setTouched(true)} 
            {...rest}/>
            <ErrorMessage name={name} />
        </FormControl>
  )
}

export default ReactSelect