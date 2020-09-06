import React, {useEffect, useState} from 'react';
import {Route, Link, RouteComponentProps, Switch} from 'react-router-dom'
import {Breadcrumb, Card, Table, ButtonToolbar, Row, Col, Form, Modal} from 'react-bootstrap';
import {useSelector} from 'react-redux';
import {StateInterface} from '../../store/store';
import {faEdit, faTrashAlt, faShareAlt, faAlignJustify} from '@fortawesome/free-solid-svg-icons';
import ThreedotsMenu, {MenuIconInterface} from '../utils/ThreedotsMenu';
import ConfirmDialog from '../utils/ConfirmDialog';
import SurveyFilter from '../../model/filter/SurveyFilter';
import SurveyModel from '../../model/SurveyModel';
import {deleteSurvey, getSurveys} from '../../api/survey/surveyApi';
import SurveyForm from './SurveyForm';
import Survey from './Survey';

const Surveys: React.FC<RouteComponentProps> = ({match, history}) => {
    const [surveys, setSurveys] = useState<Array<SurveyModel>>([]);
    const [keyword, setKeyword] = useState('');
    const lang = useSelector((state: StateInterface) => state.lang);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [filter, setFilter] = useState<SurveyFilter>({...(new SurveyFilter()), keyword: keyword});
    const [currentSelected, setCurrentSelected] = useState<SurveyModel | null>(null);
    const [isConfirmDelete, setIsConfirmDelete] = useState(false);
    const [isDisplayModalShare, setIsDisplayModalShare] = useState(false);
    const [isDisplayModalResponse, setIsDisplayModalResponse] = useState(false);

    //menu threedot
    const deleteEntity = (entity: any) => {
        setCurrentSelected(entity);
        setIsConfirmDelete(true);
    }
    const editEntity = (entity: any) => {
        history.push(`/survey/edit/${entity.id}`, {survey: entity});
    }
    const shareSurvey = (entity: any) => {
        setCurrentSelected(entity);
        setIsDisplayModalShare(true);
    }
    const viewSurveyResponse = (entity: any) => {
        setCurrentSelected(entity);
        setIsDisplayModalResponse(true);
    }

    const menuAction: Array<MenuIconInterface> = [
        {icon: faShareAlt, text: lang['share'], action: shareSurvey},
        {icon: faAlignJustify, text: lang['survey-response'], action: viewSurveyResponse},
        {icon: faEdit, text: lang['edit'], action: editEntity},
        {icon: faTrashAlt, text: lang['delete'], action: deleteEntity}
    ];
    //confirm
    const confirmOk = (item: any) => {
        setIsConfirmDelete(false);
        if (item === null) {
            return;
        }
        (async () => {
            await deleteSurvey(item);
            setSurveys(surveys.filter(i => i.id !== item.id));
            setCurrentSelected(null);
        })();
    }
    const confirmCancel = (item: any) => {
        setCurrentSelected(null);
        setIsConfirmDelete(false);
    }
    const onCloseShareModal = () => {
        setCurrentSelected(null);
        setIsDisplayModalShare(false);
    }
    const onCloseResponseModal = () => {
        setCurrentSelected(null);
        setIsDisplayModalResponse(false);
    }
    const getShareUrl = (): string => {
        if (!currentSelected) {
            return '';
        }
        return process.env.REACT_APP_DOMAIN + '/share-survey/' + (currentSelected?.id || '');
    }
    //state
    useEffect(() => {
        filter.keyword = keyword;
        (async () => {
            const response = await getSurveys(filter);
            setSurveys(response.data)
        })();
    }, [filter, keyword]);
    const SurveyList = <>
        <Breadcrumb>
            <Breadcrumb.Item active>
                <Link to={'/'}>Dashboard</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
                {lang['survey']}
            </Breadcrumb.Item>
        </Breadcrumb>
        <ButtonToolbar className={'float-right'}>
            <Link className="btn btn-primary" to={'/survey/new'}>{lang['new']} {lang['survey']}</Link>
        </ButtonToolbar>
        <h2>{lang['survey']}</h2>
        <Row>
            <Col xs lg={{span: 4, offset: 8}}>
                <Form.Control type={'text'} placeholder={lang['search']} name={'keyword'} defaultValue={filter.keyword} onChange={(e: any) => setKeyword(e.target.value)} />
            </Col>
        </Row>
        <Card>
            <Table responsive>
                <thead>
                    <tr>
                        {['Email', lang['survey-title'], lang['survey-question-total'], lang['survey-response-total'], lang['action']].map((item, key) => <th key={key}>{item}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {surveys.map((item, key) => (
                        <tr key={key}>
                            <td><Link to={`${match.url}/${item.id}`}>{item.email}</Link></td>
                            <td>{item.title}</td>
                            <td>{item.questions.length}</td>
                            <td>{item.surveyResponses?.length || 0}</td>
                            <td><ThreedotsMenu menu={menuAction} entity={item} /></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Card>
        <ConfirmDialog message={lang['delete'] + " " + lang['survey'] + " " + currentSelected?.title + " ?"} isDisplay={isConfirmDelete} onCancelAction={confirmCancel} onOkAction={confirmOk} item={currentSelected} />
        {isDisplayModalShare && <Modal show={isDisplayModalShare} onHide={onCloseShareModal}>
            <Modal.Body>
                <Form.Control type="text" readOnly={true} value={getShareUrl()} />
            </Modal.Body>
        </Modal>}
        {isDisplayModalResponse && <Modal show={isDisplayModalResponse} onHide={onCloseResponseModal}>
            <Modal.Body>
                <div>
                    This feature is not available now !
                </div>
            </Modal.Body>
        </Modal>}
    </>;

    return (
        <div>
            <Route exact path={match.path} render={() => SurveyList} />
            <Switch>
                <Route path={`${match.path}/new`} component={SurveyForm} />
                <Route path={`${match.path}/edit/:id`} component={SurveyForm} />
                <Route path={`${match.path}/:id`} component={Survey} />
            </Switch>
        </div>
    )
};

export default Surveys;
