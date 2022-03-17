import React from 'react'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import { Box, SkeletonCircle, SkeletonText } from '@chakra-ui/react';

function Loader() {
  return (
    <Box padding='6' boxShadow='lg'>
       <SkeletonCircle size='10' />
      <SkeletonText mt='4' noOfLines={12} spacing='4' />
    </Box>
  )
}

export default Loader