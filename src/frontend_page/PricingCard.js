import {
  Divider,
  Flex,
  Heading,
  Icon,
  Image,
  List,
  ListIcon,
  ListItem,
  Text,
  useColorMode,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import { HiCheckCircle } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import { formater } from '../_formater'
import Card from './Card'


function PricingCard(props) {
  const { data, label, transform, zIndex, icon, button, ...rest } = props
  const { plan_name, plan_percentage, min_amount, max_amount, plan_image, payment_interval } = data

  const { colorMode} = useColorMode()
  const isDark = colorMode === 'dark'

  return (
    <Card className={plan_name === 'CONTRACT' ? 'display-none' : ''} rounded={{ sm: 'xl' }} isPopular={label} transform={transform} zIndex={zIndex} {...rest} >
        <VStack spacing={6}>
          {plan_image === 'default.png' ?  <Icon aria-hidden as={icon} fontSize="4xl" color={isDark ? 'blue.200' : 'blue.600'} /> :<Image src={plan_image} fallbackSrc='https://via.placeholder.com/500' alt={plan_name} width={'50px'} height={'50px'} rounded={'full'} />	}
          <Heading size="lg" fontWeight="extrabold">{plan_name}</Heading>
        </VStack>
        <Flex align="flex-end" justify="center" fontWeight="extrabold" color={isDark ? 'blue.200' : 'blue.600'} >
          <Heading size="lg" fontWeight="inherit" lineHeight="0.9em">{plan_percentage}</Heading>
          <Text fontWeight="inherit" fontSize="lg">%</Text>
        </Flex>
        <Flex align="flex-end" justify="center" fontWeight="extrabold" color={isDark ? 'blue.200' : 'blue.600'} >
          <Heading size="lg" fontWeight="inherit" lineHeight="0.9em">{payment_interval}</Heading>
        </Flex>
        <List spacing="4" mb="8" maxW="28ch" mx="auto">
          <Divider mt={'5'} />
          <ListItem fontWeight="bold">
            <ListIcon fontSize="xl" as={HiCheckCircle} marginEnd={2} color={isDark ? 'blue.200' : 'blue.600'} />MIN Deposit : {formater.format(min_amount)}
          </ListItem>
          <ListItem fontWeight="bold">
            <ListIcon fontSize="xl" as={HiCheckCircle} marginEnd={2} color={isDark ? 'blue.200' : 'blue.600'} />MAX Deposit : {plan_name === 'CONTRACT' ? 'Unlimited' : formater.format(max_amount)}
          </ListItem>
          <Divider mb={'5'} />
          <ListItem fontWeight="bold">
            <ListIcon fontSize="xl" as={HiCheckCircle} marginEnd={2} color={isDark ? 'blue.200' : 'blue.600'} />Referral Bonus : 5%
          </ListItem>
          <ListItem fontWeight="bold">
            <ListIcon fontSize="xl" as={HiCheckCircle} marginEnd={2} color={isDark ? 'blue.200' : 'blue.600'} />Withdrawals Payout: Fridays
          </ListItem>
          <ListItem fontWeight="bold">
            <ListIcon fontSize="xl" as={HiCheckCircle} marginEnd={2} color={isDark ? 'blue.200' : 'blue.600'} />24/7 Live Support
          </ListItem>
        </List>
        <Link to={'/register'}>
          {button}
        </Link>
    </Card>
  )
}

export default PricingCard