import React, {FormEvent, useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Form, Card, Col, Nav} from 'react-bootstrap';
import {RouteComponentProps} from 'react-router';
import client from '../../api/client';
import {LOGIN_SUCCESS, LOGIN_FAILURE, ERROR_GENERAL} from '../../store/types';
import LoadingButton from '../utils/LoadingButton';
import {NavLink} from 'react-router-dom';
import {clearError} from '../utils/Error';
import {StateInterface} from '../../store/store';

const UserLogin: React.FC<RouteComponentProps<{}, any, {from?: string}>> = ({history, location}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const lang = useSelector((state: StateInterface) => state.lang);
    const dispatch = useDispatch();
    useEffect(() => {
        client.logout();
    }, []);

    const canSubmit = (): boolean => {
        return Boolean(email && password && !loading);
    };

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        clearError(dispatch);
        try {
            await client.login({username: email, password: password});
            dispatch({type: LOGIN_SUCCESS});
            var url = '/';
            if (location && location.state && location.state.from) {
                url = location.state.from;
            }
            history.push(url);
            window.location.reload();
        } catch (err) {
            dispatch({type: ERROR_GENERAL, message: lang['login-failed']});
            dispatch({type: LOGIN_FAILURE});
        }
        setLoading(false);
    };

    return (
        <div className={'login-box'}>
            <h2 className={'text-center text-primary'}>{lang['login-title']}</h2>
            <Card className={'mt-3'}>
                <Card.Body>
                    <Form onSubmit={submit}>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type={'email'} placeholder={'Email'} onChange={(e: any) => setEmail(e.currentTarget.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{lang['password']}</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={(e: any) => setPassword(e.currentTarget.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Nav.Link as={NavLink} to={'/forgot-password-request'}>{lang['reset-password']}</Nav.Link>
                            <Col className={'text-right pr-0'} md={{span: 6, offset: 6}}>
                                <LoadingButton loading={loading} disabled={!canSubmit()}>{lang['login']}</LoadingButton>
                            </Col>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default UserLogin;
