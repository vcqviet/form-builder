import React, {FormEvent, useState} from 'react';
import Form from 'react-bootstrap/Form';
import {Breadcrumb, Card, Col} from 'react-bootstrap';
import {History, Location} from 'history';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {clearError, setError} from '../utils/Error';
import LoadingButton from '../utils/LoadingButton';
import {StateInterface} from '../../store/store';
import SurveyModel from '../../model/SurveyModel';
import {putSurvey, patchSurvey} from '../../api/survey/surveyApi';

type SurveyFormProps = {
    history: History;
    location: Location<{survey?: SurveyModel}>;
}
const SurveyForm: React.FC<SurveyFormProps> = ({history, location}) => {
    const lang = useSelector((state: StateInterface) => state.lang);
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const isNew = !(location.state?.survey?.email);
    const [survey, setSurvey] = useState<SurveyModel>(location.state?.survey || new SurveyModel());
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
                isNew ? await putSurvey(survey) : await patchSurvey(survey);
                history.push(`/survey/${survey.id}`);
            } catch (err) {
                setError(dispatch, err.message);
                setLoading(false);
            }
        })();
    };

    const handleChange = (element: any) => {
        clearError(dispatch);
        setSurvey({...survey, [element.target.name]: element.target.value});
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
                {!isNew &&
                    <Breadcrumb.Item active>
                        <Link to={`/survey/${survey.id}`}>{survey.id}</Link>
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

                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control autoComplete={'off'} required type={'email'} name={'email'} value={survey.email} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{lang['survey-title']}</Form.Label>
                            <Form.Control autoComplete={'off'} required type={'text'} name={'title'} value={survey.title} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{lang['survey-description']}</Form.Label>
                            <Form.Control as={'textarea'} autoComplete={'off'} required name={'description'} value={survey.description} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{lang['survey-note']}</Form.Label>
                            <Form.Control as={'textarea'} autoComplete={'off'} required name={'note'} value={survey.note} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{lang['survey-question']}</Form.Label>
                            <Card>
                                <Card.Body>
                                    
                                </Card.Body>
                            </Card>
                        </Form.Group>
                        <LoadingButton loading={loading}>{lang['save']}</LoadingButton>
                    </Form>
                </Card.Body>
            </Card>
        </>
    )
};

export default SurveyForm;
