import {
    Box,
    Text,
    Stack,
    Flex,
    Button,
    Spacer,
    Divider,
    Heading,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    useColorMode
  } from '@chakra-ui/react';
import { FiRepeat } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { formater } from '../_formater';
  
 function HomeSummaryCard(props) {   
   const { title, url, amount, total, percent } = props
  const { colorMode} = useColorMode()
  const isDark = colorMode === 'dark' 
    return (
      <Box py={10} p={5} boxShadow={'2xl'}  rounded={'md'} bg={isDark ? 'grey.800' : 'white'}>
          <Flex>
            <Text fontSize={'3xl'}>{title}</Text>
            <Spacer />
            <Link to={url}>
              <Button variant={'solid'} colorScheme={'teal'}>View</Button>
            </Link>
          </Flex>
          <Divider mt={'3'} mb={'3'} />
          <Stack mb={'3'}>
            <Text fontWeight={'bold'}>Last:</Text>
            <Heading fontSize={'2xl'}>{formater.format(amount)}</Heading>
          </Stack>
          <Slider aria-label='sliider-ex-4' defaultValue={percent}>
            <SliderTrack bg='red.100'>
              <SliderFilledTrack bg='tomato'  />
            </SliderTrack>
            <SliderThumb boxSize={6}>
              <Box color='tomato' as={FiRepeat}/>
            </SliderThumb>
          </Slider>
          <Flex>
            <Text fontSize={'2xl'}>Total</Text>
            <Spacer />
            <Heading fontSize={'3xl'}>{formater.format(total)}</Heading>
          </Flex>
        </Box>
    );
  }

export default HomeSummaryCard