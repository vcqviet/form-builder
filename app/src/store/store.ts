import {combineReducers, createStore} from 'redux';
import authReducer from './reducers/authReducer';
import errorReducer from './reducers/errorReducer';
import i18nReducer from './reducers/i18nReducer';

let rootReducer = combineReducers({
    auth: authReducer,
    error: errorReducer,
    lang: i18nReducer
});

export type StateInterface = ReturnType<typeof rootReducer>

export default createStore(rootReducer);
