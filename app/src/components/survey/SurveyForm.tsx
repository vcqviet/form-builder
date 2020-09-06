import React, {FormEvent, useState} from 'react';
import Form from 'react-bootstrap/Form';
import {Breadcrumb, Card, Col} from 'react-bootstrap';
import {History, Location} from 'history';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {clearError, setError} from '../utils/Error';
import LoadingButton from '../utils/LoadingButton';
import {StateInterface} from '../../store/store';
import FormBuilderModel from '../../model/FormBuilderModel';
import {putFormBuilder, patchFormBuilder} from '../../api/formBuilder/formBuilderApi';

type FormBuilderFormProps = {
    history: History;
    location: Location<{formBuilder?: FormBuilderModel}>;
}
const FormBuilderForm: React.FC<FormBuilderFormProps> = ({history, location}) => {
    const lang = useSelector((state: StateInterface) => state.lang);
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const isNew = !(location.state?.formBuilder?.email);
    const [formBuilder, setFormBuilder] = useState<FormBuilderModel>(location.state?.formBuilder || new FormBuilderModel());
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
                isNew ? await putFormBuilder(formBuilder) : await patchFormBuilder(formBuilder);
                history.push(`/form-builder/${formBuilder.id}`);
            } catch (err) {
                setError(dispatch, err.message);
                setLoading(false);
            }
        })();
    };

    const handleChange = (element: any) => {
        clearError(dispatch);
        setFormBuilder({...formBuilder, [element.target.name]: element.target.value});
    };
    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item active>
                    <Link to={'/'}>Dashboard</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active>
                    <Link to={'/form-builder'}>{lang['form-builder']}</Link>
                </Breadcrumb.Item>
                {!isNew &&
                    <Breadcrumb.Item active>
                        <Link to={`/form-builder/${formBuilder.id}`}>{formBuilder.id}</Link>
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
                            <Form.Control autoComplete={'off'} required type={'email'} name={'email'} value={formBuilder.email} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{lang['json-format']}</Form.Label>
                            <Form.Control as={'textarea'} autoComplete={'off'} required name={'jsonFormat'} value={formBuilder.jsonFormat} />
                        </Form.Group>
                        <LoadingButton loading={loading}>{lang['save']}</LoadingButton>
                    </Form>
                </Card.Body>
            </Card>
        </>
    )
};

export default FormBuilderForm;
