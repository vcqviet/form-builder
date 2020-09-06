import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Alert} from 'react-bootstrap';
import {ERROR_GENERAL} from '../../store/types';
import {StateInterface} from '../../store/store';

export const clearError = (dispatch: any) => {
    setError(dispatch, '');
}
export const setError = (dispatch: any, error: string) => {
    dispatch({type: ERROR_GENERAL, message: error});
}

type ErrorProps = {
    error?: string
}

const Error: React.FC<ErrorProps> = (props) => {
    const errorState = useSelector((state: StateInterface) => state.error);
    const [error, setError] = useState(props.error || errorState.message);
    const dispatch = useDispatch();
    const onClickCloseHandle = () => {
        dispatch({type: ERROR_GENERAL, error: ''});
        setError('');
    }

    return (
        <>{(error || errorState.message) &&
            <Alert variant={'danger'} className={'mt-5'} onClose={onClickCloseHandle} dismissible>
                {error || errorState.message}
            </Alert>}
        </>
    );
};

export default Error;
