import React, {FormEvent, useState, useEffect} from 'react';
import {ButtonGroup, ButtonToolbar, Card, Form} from 'react-bootstrap';
import {RouteComponentProps} from 'react-router';
import {useDispatch, useSelector} from 'react-redux';
import {NavLink} from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import client from '../../api/client';
import {ERROR_GENERAL} from '../../store/types';
import LoadingButton from '../utils/LoadingButton';
import {StateInterface} from '../../store/store';

const PasswordReset: React.FC<RouteComponentProps<{token: string}>> = ({history, match}) => {
    const lang = useSelector((state: StateInterface) => state.lang);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [failed, setFailed] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        client.logout();
    }, []);

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        dispatch({type: ERROR_GENERAL, error: ''});
        setFailed(false);
        try {
            await client.resetPassword(match.params.token, password);
            setSuccess(true);
        } catch (err) {
            dispatch({type: ERROR_GENERAL, error: err.message});
            setFailed(true);
        }
        setLoading(false);
    };

    const canSubmit = (): boolean => {
        return password.length >= 6 && !loading;
    };

    return (
        <div className={'login-box'}>
            <h2 className={'text-center'}>{lang['reset-password']}</h2>
            <Card>
                <Card.Body>
                    {success && <p>{lang['reset-password-success']} <a href={'/login'}>{lang['login-now']}</a></p>}
                    {!success && <Form onSubmit={submit}>
                        <Form.Group>
                            <Form.Label>{lang['password']}</Form.Label>
                            <Form.Control type="password" placeholder={lang['new-password']} onChange={(e: any) => setPassword(e.currentTarget.value)} />
                            {!canSubmit() && <Form.Text>{lang['password-invalid']}</Form.Text>}
                        </Form.Group>
                        <Form.Group>
                            <ButtonToolbar>
                                <ButtonGroup>
                                    <LoadingButton loading={loading} disabled={!canSubmit()}>{lang['reset']}</LoadingButton>
                                </ButtonGroup>
                                {failed && <ButtonGroup>
                                    <Nav.Link as={NavLink} to={'/login'}>{lang['login']}</Nav.Link>
                                </ButtonGroup>}
                            </ButtonToolbar>
                        </Form.Group>
                    </Form>}
                </Card.Body>
            </Card>
        </div>
    );
};

export default PasswordReset;
