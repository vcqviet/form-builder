import {History, Location} from "history";
import React, {FormEvent, useEffect, useState} from "react";
import {Breadcrumb, Card, Form, Col} from "react-bootstrap";
import {Link} from "react-router-dom";
import LoadingButton from "../utils/LoadingButton";
import {useDispatch, useSelector} from "react-redux";
import {StateInterface} from "../../store/store";
import {clearError, setError} from "../utils/Error";
import PasswordChangeModel from "../../model/PasswordChangeModel";
import {changePassword} from "../../api/user/userApi";
import AlertDialog from "../utils/AlertDialog";

type ChangePasswordFormProps = {
    history: History;
    location: Location<{profileId: string}>;
}
const ChangePassword: React.FC<ChangePasswordFormProps> = ({history, location}) => {
    const lang = useSelector((state: StateInterface) => state.lang);
    const [validated, setValidated] = useState(false);
    const [passwordChange, setPasswordChange] = useState(new PasswordChangeModel());
    const [loading, setLoading] = useState(false);
    const [isShowAlert, setIsShowAlert] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        setPasswordChange({...passwordChange, id: location.state.profileId});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (element: any) => {
        clearError(dispatch);
        setPasswordChange({...passwordChange, [element.target.name]: element.target.value});
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        setLoading(true);
        setValidated(true);
        clearError(dispatch);
        event.preventDefault();

        if (!event.currentTarget.checkValidity()) {
            setError(dispatch, lang['error-form-required']);
            setLoading(false);
            return;
        }
        if(passwordChange.newPassword !== passwordChange.newPasswordConfirm) {
            setError(dispatch, lang['different-password-confirm']);
            setLoading(false);
            return;
        }

        (async () => {
            try {
                await changePassword(passwordChange);
                setLoading(false);
                setIsShowAlert(true);
            } catch (err) {
                setError(dispatch, err.message);
                setLoading(false);
            }
        })();
    };

    const onCloseAlertAction = () => {
        setIsShowAlert(false);
        history.push('/login');
    };

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item active>
                    <Link to={'/'}>Dashboard</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active>
                    <Link to={'/user'}>{lang['user']}</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active>
                    {lang['change-password']}
                </Breadcrumb.Item>
            </Breadcrumb>
            <h2>{lang['change-password']}</h2>
            <Card>
                <Card.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit} onChange={(e: FormEvent<HTMLFormElement>) => {handleChange(e)}}>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>{lang['old-password']}</Form.Label>
                                <Form.Control autoComplete={'off'} required name={'oldPassword'} type={'password'} defaultValue={""} />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>{lang['new-password']}</Form.Label>
                                <Form.Control autoComplete={'off'} required name={'newPassword'} type={'password'} defaultValue={""} />
                            </Form.Group>
                        </Form.Row>
                        <Form.Group>
                            <Form.Label>{lang['confirm'] + " " + lang['new-password'] + " " + lang['again']}</Form.Label>
                            <Form.Control autoComplete={'off'} required type={'password'} name={'newPasswordConfirm'} defaultValue={""} />
                        </Form.Group>
                        <LoadingButton loading={loading}>{lang['save']}</LoadingButton>
                    </Form>
                </Card.Body>
            </Card>
            <AlertDialog item={passwordChange} message={lang['alert-modal-default-message'] + " " + lang['logout']} title={lang['change-password-success']} isDisplay={isShowAlert} onCloseAction={onCloseAlertAction} />
        </>
    );

};

export default ChangePassword;