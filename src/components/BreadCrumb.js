import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
  } from '@chakra-ui/react'
import React from 'react';
import { Link } from 'react-router-dom';

function BreadCrumb(props) {
    const { links } = props
  return (
    <Breadcrumb>
        {
            links.length ?
            links.map(link => {
                return (
                    <BreadcrumbItem key={link.value}>
                        <BreadcrumbLink as={Link} to={link.url}>{link.value}</BreadcrumbLink>
                    </BreadcrumbItem>
                )
            }) : 
            <BreadcrumbItem isCurrentPage >
                <BreadcrumbLink as={Link} to='/dashboard'>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
        }   
    </Breadcrumb>
  );
}

export default BreadCrumb;
