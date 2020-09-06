import React, {FormEvent, useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ButtonGroup, ButtonToolbar, Form, Card} from 'react-bootstrap';
import {RouteComponentProps} from 'react-router';
import {NavLink} from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import client from '../../api/client';
import {ERROR_GENERAL} from '../../store/types';
import LoadingButton from '../utils/LoadingButton';
import {StateInterface} from '../../store/store';

const ForgotPasswordRequest: React.FC<RouteComponentProps> = (props) => {
    const lang = useSelector((state: StateInterface) => state.lang);
    const [email, setEmail] = useState('');
    const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        client.logout();
    }, []);

    const canSubmit = (): boolean => {
        return Boolean(email && !loading);
    };

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        dispatch({type: ERROR_GENERAL, error: ''});
        try {
            await client.requestPasswordReset(email);
            setResetPasswordSuccess(true);
        } catch (err) {
            dispatch({type: ERROR_GENERAL, error: err.message});
        }
        setLoading(false);
    };

    return (
        <div className={'login-box'}>
            <h2 className={'text-center'}>{lang['forgot-password']}</h2>
            <Card>
                <Card.Body>
                    <Form onSubmit={submit}>
                        {resetPasswordSuccess
                            ? <p>{(lang['forgot-password-success'] + '').replace('{email}', email)}</p>
                            : <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type={'email'} placeholder={'Email'} onChange={(e: any) => setEmail(e.currentTarget.value)} />
                            </Form.Group>
                        }
                        <ButtonToolbar>
                            <ButtonGroup>
                                {!resetPasswordSuccess && <LoadingButton loading={loading} disabled={!canSubmit()}>{lang['reset']}</LoadingButton>}
                            </ButtonGroup>
                            <ButtonGroup>
                                <Nav.Link as={NavLink} to={'/login'}>{lang['login']}</Nav.Link>
                            </ButtonGroup>
                        </ButtonToolbar>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ForgotPasswordRequest;
