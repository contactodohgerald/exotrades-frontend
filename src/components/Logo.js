import { 
    Image
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { BASE_URL } from '../api_routes';
import API_TOKEN from '../token';
import swal from 'sweetalert'
import { Link } from 'react-router-dom'

function Logo({ children, ...rest }) {
  const [siteStettings, setSiteStettings] = useState(false)

  const getSiteSettingsDetails = () => {
      axios.get(BASE_URL+'get-site-settings', {
          headers: {
              'Authorization': `Bearer ${API_TOKEN}` 
          }
      })
      .then(respond => {
          const users = respond.data
          setSiteStettings(users)
      })
      .catch(error => {
          const errorMsg = error.message
          swal({
              title: "Error",
              text: errorMsg,
              icon: "error"
          })
          return
      })
  }
  useEffect(() => {
      getSiteSettingsDetails()
  }, [])
  
  return (
      <>
        <Link to='/'>
            <Image src={siteStettings ? siteStettings.payload.site_logo_url : ''} {...rest} alt={siteStettings ? siteStettings.payload.site_name : ''} />
        </Link>
        {children}
      </>
  )
}

export default Logo;