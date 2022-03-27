import { ListIcon, ListItem } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

function NavItem({ icon, children, url_to, ...rest }) {
  return (
    <Link to={url_to} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
        <ListItem p={{ base: 2, md: 2 }} mx="4" cursor="pointer" _hover={{  bg: 'cyan.400', color: 'white',}} {...rest}>
          <ListIcon as={icon} color='green.500' />
          {children}
        </ListItem>
    </Link>
  )
}

export default NavItem;
