import { combineReducers } from "redux";
import loginUserReducer from './LoginUser/userLoginReducer'

const rootReducers = combineReducers({
    loginReducer: loginUserReducer,
})

export default rootReducers