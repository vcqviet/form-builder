import React, {useEffect, useState} from 'react';
import {RouteComponentProps} from 'react-router';
import {Breadcrumb, ButtonToolbar, Card, Badge, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import UserModel from '../../model/UserModel';
import {deleteUser, getUser} from '../../api/user/userApi';
import {useDispatch, useSelector} from 'react-redux';
import {StateInterface} from '../../store/store';
import {setError} from "../utils/Error";
import ConfirmDialog from "../utils/ConfirmDialog";

const User: React.FC<RouteComponentProps<{id: string}>> = ({match, history}) => {
    const [user, setUser] = useState(new UserModel());
    const lang = useSelector((state: StateInterface) => state.lang);
    const [isDisplayConfirmDelete, setIsDisplayConfirmDelete] = useState(false);
    const dispatch = useDispatch();
    const handleShowModal = () => setIsDisplayConfirmDelete(true);
    const handleCloseModal = () => setIsDisplayConfirmDelete(false);

    useEffect(() => {
        (async () => {
            const response = await getUser(match.params.id);
            setUser(response.data)
        })();
    }, [match]);

    const deleteUserHandler = (item: any) => {
        (async () => {
            try {
                await deleteUser(user);
                history.push('/user');
            } catch (err) {
                setError(dispatch, err.message);
            }
        })();
        handleCloseModal();
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
                    {user.firstName} {user.lastName}
                </Breadcrumb.Item>
            </Breadcrumb>

            <ButtonToolbar className={'actions float-right'} >
                <Button className="btn btn-danger" onClick={handleShowModal}>{lang['delete']} {lang['user']}</Button>
                <Link className="btn btn-primary" to={{pathname: `/user/edit/${user.id}`, state: {user: user}}}>{lang['edit']} {lang['user']}</Link>
            </ButtonToolbar>
            <h2>{user.firstName} {user.lastName}</h2>
            <Card>
                <Card.Body>
                    <dl className="row">
                        <dt className="col-sm-3">{lang['full-name']}:</dt>
                        <dd className="col-sm-9">{user.firstName} {user.lastName}</dd>
                        <dt className="col-sm-3">Email:</dt>
                        <dd className="col-sm-9">{user.email}</dd>
                        <dt className="col-sm-3">{lang['phone-number']}:</dt>
                        <dd className="col-sm-9">{user.phone}</dd>
                        <dt className="col-sm-3">{lang['role']}:</dt>
                        <dd className="col-sm-9">
                            {user.roles.map((item, key) => (
                                <><Badge key={key} variant={'info'}>{lang[item]}</Badge> <br /></>
                            ))}
                        </dd>
                    </dl>
                </Card.Body>
            </Card>
            <ConfirmDialog item={user} message={lang['delete'] + " " + lang['user'] + " " + user.firstName + " " + user.lastName + " ?"} isDisplay={isDisplayConfirmDelete} onCancelAction={handleCloseModal} onOkAction={deleteUserHandler} />
        </>
    )
};

export default User;
