import React, {useEffect, useState} from 'react';
import {Route, Link, RouteComponentProps, Switch} from 'react-router-dom'
import {Breadcrumb, Card, Table, ButtonToolbar, Row, Col, Form} from 'react-bootstrap';
import {getUsers, deleteUser, adminGeneratePassword} from '../../api/user/userApi';
import UserModel from '../../model/UserModel';
import UserForm from './UserForm';
import User from './User';
import UserFilter from '../../model/filter/UserFilter';
import {useDispatch, useSelector} from 'react-redux';
import {StateInterface} from '../../store/store';
import {faEdit, faTrashAlt, faKey} from '@fortawesome/free-solid-svg-icons';
import ThreedotsMenu, {MenuIconInterface} from '../utils/ThreedotsMenu';
import ConfirmDialog from '../utils/ConfirmDialog';
import {ElementType} from "../utils/FormInputModal";
import FormInputModal from "../utils/FormInputModal";
import {setError} from "../utils/Error";
import FbsString from '../../utils/string';

const Users: React.FC<RouteComponentProps> = ({match, history}) => {
    const [users, setUsers] = useState<Array<UserModel>>([]);
    const [keyword, setKeyword] = useState('');
    const lang = useSelector((state: StateInterface) => state.lang);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [filter, setFilter] = useState<UserFilter>({...(new UserFilter()), keyword: keyword});
    const [currentSelected, setCurrentSelected] = useState<UserModel | null>(null);
    const [isConfirmDelete, setIsConfirmDelete] = useState(false);
    const [isDisplayFormInput, setIsDisplayFormInput] = useState(false);
    const [password, setPassword] = useState('');
    const [isGeneratingPassword, setIsGeneratingPassword] = useState(false);
    const [randomPassword, setRandomPassword] = useState<string>(lang['random']);
    const dispatch = useDispatch();

    //menu threedot
    const deleteEntity = (entity: any) => {
        setCurrentSelected({...entity});
    }
    const editEntity = (entity: any) => {
        history.push(`/user/edit/${entity.id}`, {user: entity});
    }
    const generatePassword = (entity: any) => {
        setCurrentSelected({...entity});
        setIsGeneratingPassword(true);
    }

    const generatePasswordHandler = () => {
        (async () => {
            try {
                await adminGeneratePassword({
                    'id': currentSelected?.id,
                    'password': password
                });
                window.location.reload();
            } catch (err) {
                setError(dispatch, err.message);
            }
            setIsDisplayFormInput(false);
        })();
    }
    const onPasswordChange = (value: string) => {
        setPassword(value);
    }
    const generateRandomString = () => {
        const password = FbsString.random(6);
        setPassword(password);
        setRandomPassword(password);
    }
    const menuAction: Array<MenuIconInterface> = [
        {icon: faKey, text: lang['generate-password'], action: generatePassword},
        {icon: faEdit, text: lang['edit'], action: editEntity},
        {icon: faTrashAlt, text: lang['delete'], action: deleteEntity}
    ];
    //confirm
    const confirmOk = (item: any) => {
        if (item === null) {
            return;
        }
        (async () => {
            await deleteUser(item);
            setUsers(users.filter(i => i.id !== item.id));
            setCurrentSelected(null);
        })();
    }
    const confirmCancel = (item: any) => {
        setCurrentSelected(null);
    }
    //state
    useEffect(() => {
        setIsConfirmDelete(false);
        setIsDisplayFormInput(false);
        setPassword('');
        if (currentSelected !== null) {
            if (isGeneratingPassword) {
                setIsDisplayFormInput(true);
                return
            }
            setIsConfirmDelete(true);
            return;
        }
    }, [currentSelected, isGeneratingPassword]);
    useEffect(() => {
        filter.keyword = keyword;
        (async () => {
            const response = await getUsers(filter);
            setUsers(response.data)
        })();
    }, [filter, keyword]);
    const UserList = <>
        <Breadcrumb>
            <Breadcrumb.Item active>
                <Link to={'/'}>Dashboard</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
                {lang['user']}
            </Breadcrumb.Item>
        </Breadcrumb>
        <ButtonToolbar className={'float-right'}>
            <Link className="btn btn-primary" to={'/user/new'}>{lang['new']} {lang['user']}</Link>
        </ButtonToolbar>
        <h2>{lang['user']}</h2>
        <Row>
            <Col xs lg={{span: 4, offset: 8}}>
                <Form.Control type={'text'} placeholder={lang['search']} name={'keyword'} defaultValue={filter.keyword} onChange={(e: any) => setKeyword(e.target.value)} />
            </Col>
        </Row>
        <Card>
            <Table responsive>
                <thead>
                    <tr>
                        {['Email', lang['role'], ''].map((item, key) => <th key={key}>{item}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {users.map((item, key) => (
                        <tr key={key}>
                            <td><Link to={`${match.url}/${item.id}`}>{item.email}</Link></td>
                            <td><code>{item.roles.map(i => lang[i]).join(', ')}</code></td>
                            <td><ThreedotsMenu menu={menuAction} entity={item} /></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Card>
        <ConfirmDialog message={lang['delete'] + " " + lang['user'] + " " + currentSelected?.firstName + " " + currentSelected?.lastName + " ?"} isDisplay={isConfirmDelete} onCancelAction={confirmCancel} onOkAction={confirmOk} item={currentSelected} />
        <FormInputModal item={currentSelected} title={lang['generate-password']} elements={[
            {
                value: password,
                type: ElementType.PASSWORD,
                name: 'generate-password',
                onChange: onPasswordChange
            },
            {
                value: randomPassword,
                type: ElementType.LINK_ACTION,
                name: 'generate-password-link',
                onChange: () => {},
                clickAction: generateRandomString

            }
        ]} isDisplay={isDisplayFormInput} onCancelAction={(item: any) => setIsDisplayFormInput(false)} onOkAction={generatePasswordHandler} />
    </>;

    return (
        <div>
            <Route exact path={match.path} render={() => UserList} />
            <Switch>
                <Route path={`${match.path}/new`} component={UserForm} />
                <Route path={`${match.path}/edit/:id`} component={UserForm} />
                <Route path={`${match.path}/:id`} component={User} />
            </Switch>
        </div>
    )
};

export default Users;
