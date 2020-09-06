import {ERROR_GENERAL} from '../types';

const initialState = {
    statusCode: 200,
    message: ''
};

interface ErrorAction {
    type: string;
    message: string;
}

const errorReducer = (state = initialState, action: ErrorAction) => {
    if (action.message === '') {
        return {...state, statusCode: 200, message: ''};
    }
    switch (action.type) {
        case ERROR_GENERAL:
            return {...state, statusCode: 400, message: action.message};
        default:
            return state;
    }
};

export default errorReducer;
