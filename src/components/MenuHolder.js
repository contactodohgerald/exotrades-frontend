import {
    Menu,
    MenuButton,
    IconButton,
  } from '@chakra-ui/react'
import React from 'react';
import { FaHamburger } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';

function MenuHolder() {
    return (
        <Menu>
            <MenuButton
            as={IconButton}
            aria-label='Options'
            icon={<FaHamburger />}
            variant='outline'
            >
            Action <FiChevronDown />
            </MenuButton>
        </Menu>
    );
}

export default MenuHolder;
