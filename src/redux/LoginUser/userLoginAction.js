import axios from "axios";
import { BASE_URL } from "../../api_routes";
import { 
    LOGIN_USER_REQUEST, 
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILURE 
} from "./userLoginType";
import { history } from "../../history";

export const loginUserRequest = () => {
    return {
        type: LOGIN_USER_REQUEST,
    }
}

const loginUserSuccess = userToken => {
    return {
        type: LOGIN_USER_SUCCESS,
        payload: userToken,
    }
}

const loginUserFailure = error => {
    return {
        type: LOGIN_USER_FAILURE,
        payload: error,
    }
}

export const loginUsers = values => {
    return (dispatch) => {
        dispatch(loginUserRequest)
        axios.post(BASE_URL+'login', values)
        .then(respond => {
            //return the data from the api on success
            const token = respond.data.payload.data.access_token
            dispatch(loginUserSuccess(token));
            history.push('/dashboard')
            //alert('Login was successfull')
        })
        .catch(error => {
            //return an error message
            console.log('error', error.message)
            const errorMsg = error.message
            dispatch(loginUserFailure(errorMsg))
        })
    }
}