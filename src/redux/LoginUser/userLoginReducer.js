import { 
    LOGIN_USER_REQUEST, 
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILURE 
} from "./userLoginType";

const initialState = {
    loading: false,
    userToken: {},
    error: ''
}

const userLoginReducer = (state = initialState, action) => {
    switch(action.type){
        case LOGIN_USER_REQUEST: return {
            ...state,
            loading: true,
        }

        case LOGIN_USER_SUCCESS: 
        localStorage.setItem('user_token', JSON.stringify(action.payload))
        return {
            loading: false,
            userToken: action.payload,
            error: ''
        }

        case LOGIN_USER_FAILURE: return {
            loading: false,
            userToken: [],
            error: action.payload
        }

        default: return state
    }
}

export default userLoginReducer