import React, {FormEvent, useState} from 'react';
import Form from 'react-bootstrap/Form';
import {Breadcrumb, Card, Col} from 'react-bootstrap';
import {History, Location} from 'history';
import {Link} from 'react-router-dom';
import UserModel, {UserRole} from '../../model/UserModel';
import {useDispatch, useSelector} from 'react-redux';
import {clearError, setError} from '../utils/Error';
import {putUser, patchUser} from '../../api/user/userApi';
import LoadingButton from '../utils/LoadingButton';
import SearchMultiSelection, {SearchMultiSelectionItem} from '../utils/SearchMultiSelection';
import {StateInterface} from '../../store/store';

type UserFormProps = {
    history: History;
    location: Location<{user?: UserModel}>;
}
const UserForm: React.FC<UserFormProps> = ({history, location}) => {
    const lang = useSelector((state: StateInterface) => state.lang);
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const isNew = !(location.state?.user?.email);
    const [user, setUser] = useState<UserModel>(location.state?.user || new UserModel());
    const dispatch = useDispatch();

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

        (async () => {
            try {
                isNew ? await putUser(user) : await patchUser(user);
                history.push(`/user/${user.id}`);
            } catch (err) {
                setError(dispatch, err.message);
                setLoading(false);
            }
        })();
    };

    const handleChange = (element: any) => {
        clearError(dispatch);
        setUser({...user, [element.target.name]: element.target.value});
    };
    const compareArrays = (first: Array<string>, second: Array<string>): boolean => {
        return first.every((e) => second.includes(e)) && second.every((e) => first.includes(e));
    }
    const onChangeRoles = (typesSelected: Array<SearchMultiSelectionItem>, user: any) => {
        clearError(dispatch);
        var roles = typesSelected.map(item => item.value);

        if (compareArrays(user.roles, roles)) {
            return false;
        }
        setUser({...user, roles: roles});
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
                {!isNew &&
                    <Breadcrumb.Item active>
                        <Link to={`/user/${user.id}`}>{user.firstName} {user.lastName}</Link>
                    </Breadcrumb.Item>
                }
                <Breadcrumb.Item active>
                    {!isNew ? lang['edit'] : lang['new']}
                </Breadcrumb.Item>
            </Breadcrumb>
            <h2>{!isNew ? lang['edit'] : lang['new']} {lang['user']}</h2>
            <Card>
                <Card.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit} onChange={(e: FormEvent<HTMLFormElement>) => {handleChange(e)}}>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>{lang['first-name']}</Form.Label>
                                <Form.Control autoComplete={'off'} required name={'firstName'} defaultValue={user.firstName} />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>{lang['last-name']}</Form.Label>
                                <Form.Control autoComplete={'off'} required name={'lastName'} defaultValue={user.lastName} />
                            </Form.Group>
                        </Form.Row>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control autoComplete={'off'} required type={'email'} name={'email'} defaultValue={user.email} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{lang['phone-number']}</Form.Label>
                            <Form.Control autoComplete={'off'} required name={'phone'} defaultValue={user.phone} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{lang['role']}</Form.Label>
                            <SearchMultiSelection
                                data={Object.entries(UserRole).map(item => ({id: item[0], text: lang[item[1]], value: item[0]}))}
                                placeholder={lang['role']}
                                onChange={(typesSelected: Array<SearchMultiSelectionItem>) => {onChangeRoles(typesSelected, user)}}
                                selected={user.roles.map(role => ({id: role, text: lang[role], value: role}))}
                            />
                        </Form.Group>
                        <LoadingButton loading={loading}>{lang['save']}</LoadingButton>
                    </Form>
                </Card.Body>
            </Card>
        </>
    )
};

export default UserForm;
