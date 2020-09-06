import React, {FormEvent, useState} from 'react';
import Form from 'react-bootstrap/Form';
import {Breadcrumb, Card, Col, Button, Row} from 'react-bootstrap';
import {History, Location} from 'history';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {clearError, setError} from '../utils/Error';
import LoadingButton from '../utils/LoadingButton';
import {StateInterface} from '../../store/store';
import SurveyModel from '../../model/SurveyModel';
import {putSurvey, patchSurvey} from '../../api/survey/surveyApi';
import QuestionModel, {QuestionType} from '../../model/QuestionModel';
import {faPlus, faMinus, faTimes} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import OptionModel from '../../model/OptionModel';

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

    const handleEmailChange = (e: any) => {
        clearError(dispatch);
        setSurvey({...survey, email: e.target.value});
    };
    const handleTitleChange = (e: any) => {
        clearError(dispatch);
        setSurvey({...survey, title: e.target.value});
    };
    const handleDescriptionChange = (e: any) => {
        clearError(dispatch);
        setSurvey({...survey, description: e.target.value});
    };
    const handleNoteChange = (e: any) => {
        clearError(dispatch);
        setSurvey({...survey, note: e.target.value});
    };
    const onAddQuestionHandler = (e: any) => {
        survey.questions.push(new QuestionModel());
        setSurvey({...survey});
    }
    const onRemoveQuestionHandler = (id: string) => {
        survey.questions = survey.questions.filter(i => i.id !== id);
        setSurvey({...survey});
    }
    const onAddOptionHandler = (q: QuestionModel) => {
        q.options.push(new OptionModel());
        setSurvey({...survey});
    }
    const handleQuestionTitleChange = (q: QuestionModel, e: any) => {
        q.label = e.target.value;
        setSurvey({...survey});
    }
    const handleQuestionTypeChange = (q: QuestionModel, e: any) => {
        q.type = e.target.value;
        if (q.type === QuestionType.TYPE_INPUT_TEXT || q.type === QuestionType.TYPE_INPUT_TEXT_AREA) {
            q.options = [];
        }
        setSurvey({...survey});
    }
    const handleOptionChangeLabel = (o: OptionModel, e: any) => {
        o.text = e.target.value;
        setSurvey({...survey});
    }
    const handleOptionChangeValue = (o: OptionModel, e: any) => {
        o.value = e.target.value;
        setSurvey({...survey});
    }
    const onRemoveOptionHandler = (id: string, q: QuestionModel) => {
        q.options = q.options.filter(i => i.id !== id);
        setSurvey({...survey});
    }
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
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control autoComplete={'off'} required type={'email'} name={'email'} onChange={handleEmailChange} defaultValue={survey.email} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{lang['survey-title']}</Form.Label>
                            <Form.Control autoComplete={'off'} required type={'text'} name={'title'} onChange={handleTitleChange} defaultValue={survey.title} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{lang['survey-description']}</Form.Label>
                            <Form.Control as={'textarea'} autoComplete={'off'} name={'description'} onChange={handleDescriptionChange} defaultValue={survey.description} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{lang['survey-note']}</Form.Label>
                            <Form.Control as={'textarea'} autoComplete={'off'} name={'note'} onChange={handleNoteChange} defaultValue={survey.note} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{lang['survey-question']}</Form.Label>
                            <Card>
                                <Card.Body>
                                    {survey?.questions.map((q, k) => {
                                        return (
                                            <Row key={k}>
                                                <Col xs={9}>
                                                    <Form.Group>
                                                        <Form.Label>{lang['question-label']}</Form.Label>
                                                        <Form.Control autoComplete={'off'} required type={'text'} name={'q-label'} value={q.label} onChange={(e: any) => handleQuestionTitleChange(q, e)} />
                                                    </Form.Group>
                                                    <Form.Group>
                                                        <Form.Label>{lang['question-type']}</Form.Label>
                                                        <Form.Control as={'select'} autoComplete={'off'} required name={'q-type'} value={q.type} onChange={(e: any) => handleQuestionTypeChange(q, e)}>
                                                            {[QuestionType.TYPE_INPUT_TEXT, QuestionType.TYPE_INPUT_RADIO, QuestionType.TYPE_INPUT_CHECKBOX, QuestionType.TYPE_DROPDOWN_BOX, QuestionType.TYPE_INPUT_TEXT_AREA].map((o, ok) => {
                                                                return (
                                                                    <option value={o} key={ok}>{lang[o]}</option>
                                                                )
                                                            })}
                                                        </Form.Control>
                                                    </Form.Group>
                                                    {(q.type === QuestionType.TYPE_DROPDOWN_BOX ||
                                                        q.type === QuestionType.TYPE_INPUT_CHECKBOX ||
                                                        q.type === QuestionType.TYPE_INPUT_RADIO) &&
                                                        <Form.Group>
                                                            <Form.Label>{lang['question-option']} <span className={'text-primary cursor'} onClick={(e: any) => onAddOptionHandler(q)}><FontAwesomeIcon icon={faPlus} /></span></Form.Label>

                                                            {q.options.map((option, oKey) => {
                                                                return (
                                                                    <Row key={oKey}>
                                                                        <Col xs={5}>
                                                                            <Form.Group>
                                                                                <Form.Label>{lang['option-label']}</Form.Label>
                                                                                <Form.Control type={'text'} autoComplete={'off'} value={option.text} onChange={(e: any) => handleOptionChangeLabel(option, e)}></Form.Control>
                                                                            </Form.Group>
                                                                        </Col>
                                                                        <Col xs={5}>
                                                                            <Form.Group>
                                                                                <Form.Label>{lang['option-value']}</Form.Label>
                                                                                <Form.Control type={'text'} autoComplete={'off'} value={option.value} onChange={(e: any) => handleOptionChangeValue(option, e)}></Form.Control>
                                                                            </Form.Group>
                                                                        </Col>
                                                                        <Col xs={2}>
                                                                            <Form.Group>
                                                                                <span className={'text-danger cursor'} onClick={(e: any) => onRemoveOptionHandler(option.id, q)}><FontAwesomeIcon icon={faMinus} /></span>
                                                                            </Form.Group>
                                                                        </Col>
                                                                    </Row>
                                                                )
                                                            })
                                                            }
                                                        </Form.Group>}
                                                </Col>
                                                <Col xs={3}>
                                                    <span className={'text-danger cursor'} onClick={(e: any) => onRemoveQuestionHandler(q.id)}><FontAwesomeIcon icon={faTimes} /></span>
                                                </Col>
                                            </Row>
                                        )
                                    })}
                                    <div className={'text-right'}>
                                        <Button className={'btn-success'} onClick={onAddQuestionHandler}><FontAwesomeIcon icon={faPlus} /></Button>
                                    </div>
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
