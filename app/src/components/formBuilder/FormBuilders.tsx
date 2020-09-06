import React, {useEffect, useState} from 'react';
import {Route, Link, RouteComponentProps, Switch} from 'react-router-dom'
import {Breadcrumb, Card, Table, ButtonToolbar, Row, Col, Form} from 'react-bootstrap';
import {getFormBuilders, deleteFormBuilder} from '../../api/formBuilder/formBuilderApi';
import FormBuilderFilter from '../../model/filter/FormBuilderFilter';
import {useDispatch, useSelector} from 'react-redux';
import {StateInterface} from '../../store/store';
import {faEdit, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import ThreedotsMenu, {MenuIconInterface} from '../utils/ThreedotsMenu';
import ConfirmDialog from '../utils/ConfirmDialog';
import FormBuilderModel from '../../model/FormBuilderModel';
import FormBuilderForm from './FormBuilderForm';
import FormBuilder from './FormBuilder';

const FormBuilders: React.FC<RouteComponentProps> = ({match, history}) => {
    const [formBuilders, setFormBuilders] = useState<Array<FormBuilderModel>>([]);
    const [keyword, setKeyword] = useState('');
    const lang = useSelector((state: StateInterface) => state.lang);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [filter, setFilter] = useState<FormBuilderFilter>({...(new FormBuilderFilter()), keyword: keyword});
    const [currentSelected, setCurrentSelected] = useState<FormBuilderModel | null>(null);
    const [isConfirmDelete, setIsConfirmDelete] = useState(false);
    const dispatch = useDispatch();

    //menu threedot
    const deleteEntity = (entity: any) => {
        setCurrentSelected({...entity});
    }
    const editEntity = (entity: any) => {
        history.push(`/formBuilder/edit/${entity.id}`, {formBuilder: entity});
    }

    const menuAction: Array<MenuIconInterface> = [
        {icon: faEdit, text: lang['edit'], action: editEntity},
        {icon: faTrashAlt, text: lang['delete'], action: deleteEntity}
    ];
    //confirm
    const confirmOk = (item: any) => {
        if (item === null) {
            return;
        }
        (async () => {
            await deleteFormBuilder(item);
            setFormBuilders(formBuilders.filter(i => i.id !== item.id));
            setCurrentSelected(null);
        })();
    }
    const confirmCancel = (item: any) => {
        setCurrentSelected(null);
    }
    //state
    useEffect(() => {
        setIsConfirmDelete(false);
        if (currentSelected !== null) {
            setIsConfirmDelete(true);
            return;
        }
    }, [currentSelected]);
    useEffect(() => {
        filter.keyword = keyword;
        (async () => {
            const response = await getFormBuilders(filter);
            setFormBuilders(response.data)
        })();
    }, [filter, keyword]);
    const FormBuilderList = <>
        <Breadcrumb>
            <Breadcrumb.Item active>
                <Link to={'/'}>Dashboard</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
                {lang['form-builder']}
            </Breadcrumb.Item>
        </Breadcrumb>
        <ButtonToolbar className={'float-right'}>
            <Link className="btn btn-primary" to={'/form-builder/new'}>{lang['new']} {lang['form-builder']}</Link>
        </ButtonToolbar>
        <h2>{lang['form-builder']}</h2>
        <Row>
            <Col xs lg={{span: 4, offset: 8}}>
                <Form.Control type={'text'} placeholder={lang['search']} name={'keyword'} defaultValue={filter.keyword} onChange={(e: any) => setKeyword(e.target.value)} />
            </Col>
        </Row>
        <Card>
            <Table responsive>
                <thead>
                    <tr>
                        {['Email', 'Title'].map((item, key) => <th key={key}>{item}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {formBuilders.map((item, key) => (
                        <tr key={key}>
                            <td><Link to={`${match.url}/${item.id}`}>{item.email}</Link></td>
                            <td><ThreedotsMenu menu={menuAction} entity={item} /></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Card>
        <ConfirmDialog message={lang['delete'] + " " + lang['form-builder'] + " " + currentSelected?.email +" ?"} isDisplay={isConfirmDelete} onCancelAction={confirmCancel} onOkAction={confirmOk} item={currentSelected} />
        
    </>;

    return (
        <div>
            <Route exact path={match.path} render={() => FormBuilderList} />
            <Switch>
                <Route path={`${match.path}/new`} component={FormBuilderForm} />
                <Route path={`${match.path}/edit/:id`} component={FormBuilderForm} />
                <Route path={`${match.path}/:id`} component={FormBuilder} />
            </Switch>
        </div>
    )
};

export default FormBuilders;
