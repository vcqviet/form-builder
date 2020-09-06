import React, {useEffect, useState} from 'react';
import {RouteComponentProps} from 'react-router';
import {Breadcrumb, ButtonToolbar, Card, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {StateInterface} from '../../store/store';
import {setError} from "../utils/Error";
import ConfirmDialog from "../utils/ConfirmDialog";
import SurveyModel from '../../model/SurveyModel';
import {getSurvey, deleteSurvey} from '../../api/survey/surveyApi';

const Survey: React.FC<RouteComponentProps<{id: string}>> = ({match, history}) => {
    const [survey, setSurvey] = useState(new SurveyModel());
    const lang = useSelector((state: StateInterface) => state.lang);
    const [isDisplayConfirmDelete, setIsDisplayConfirmDelete] = useState(false);
    const dispatch = useDispatch();
    const handleShowModal = () => setIsDisplayConfirmDelete(true);
    const handleCloseModal = () => setIsDisplayConfirmDelete(false);

    useEffect(() => {
        (async () => {
            const response = await getSurvey(match.params.id);
            setSurvey(response.data)
        })();
    }, [match]);

    const deleteSurveyHandler = (item: any) => {
        (async () => {
            try {
                await deleteSurvey(survey);
                history.push('/survey');
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
                    <Link to={'/survey'}>{lang['survey']}</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active>
                    {survey.email}
                </Breadcrumb.Item>
            </Breadcrumb>

            <ButtonToolbar className={'actions float-right'} >
                <Button className="btn btn-danger" onClick={handleShowModal}>{lang['delete']} {lang['survey']}</Button>
                <Link className="btn btn-primary" to={{pathname: `/survey/edit/${survey.id}`, state: {survey: survey}}}>{lang['edit']} {lang['survey']}</Link>
            </ButtonToolbar>
            <h2>{survey.email}</h2>
            <Card>
                <Card.Body>
                    <dl className="row">
                        <dt className="col-sm-3">{lang['email']}:</dt>
                        <dd className="col-sm-9">{survey.email}</dd>
                    </dl>
                    <dl className="row">
                        <dt className="col-sm-3">{lang['survey-title']}:</dt>
                        <dd className="col-sm-9">{survey.title}</dd>
                    </dl>
                    <dl className="row">
                        <dt className="col-sm-3">{lang['survey-description']}:</dt>
                        <dd className="col-sm-9">{survey.description}</dd>
                    </dl>
                    <dl className="row">
                        <dt className="col-sm-3">{lang['survey-question-total']}:</dt>
                        <dd className="col-sm-9">{survey.questions.length}</dd>
                    </dl>
                    <dl className="row">
                        <dt className="col-sm-3">{lang['survey-response-total']}:</dt>
                        <dd className="col-sm-9">{survey.surveyResponse.length}</dd>
                    </dl>
                    <dl className="row">
                        <dt className="col-sm-3">{lang['note']}:</dt>
                        <dd className="col-sm-9">{survey.note}</dd>
                    </dl>
                </Card.Body>
            </Card>
            <ConfirmDialog item={survey} message={lang['delete'] + " " + lang['survey'] + " " + survey.title + " ?"} isDisplay={isDisplayConfirmDelete} onCancelAction={handleCloseModal} onOkAction={deleteSurveyHandler} />
        </>
    )
};

export default Survey;
