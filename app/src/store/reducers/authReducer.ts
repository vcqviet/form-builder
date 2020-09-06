import client from '../../api/client';
import {LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT} from '../types';

const initialState = {
    isAuthenticated: client.isLoggedIn()
};

interface UserAction {
    type: string;
}

const authReducer = (state = initialState, action: UserAction) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {...state, isAuthenticated: true};
        case LOGIN_FAILURE:
        case LOGOUT:
            return {...state, isAuthenticated: false};
        default:
            return state;
    }
};

export default authReducer;
