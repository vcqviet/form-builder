import React, {useEffect, useState} from 'react';
import {RouteComponentProps} from 'react-router';
import {Breadcrumb, ButtonToolbar, Card, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import FormBuilderModel from '../../model/FormBuilderModel';
import {deleteFormBuilder, getFormBuilder} from '../../api/formBuilder/formBuilderApi';
import {useDispatch, useSelector} from 'react-redux';
import {StateInterface} from '../../store/store';
import {setError} from "../utils/Error";
import ConfirmDialog from "../utils/ConfirmDialog";

const FormBuilder: React.FC<RouteComponentProps<{id: string}>> = ({match, history}) => {
    const [formBuilder, setFormBuilder] = useState(new FormBuilderModel());
    const lang = useSelector((state: StateInterface) => state.lang);
    const [isDisplayConfirmDelete, setIsDisplayConfirmDelete] = useState(false);
    const dispatch = useDispatch();
    const handleShowModal = () => setIsDisplayConfirmDelete(true);
    const handleCloseModal = () => setIsDisplayConfirmDelete(false);

    useEffect(() => {
        (async () => {
            const response = await getFormBuilder(match.params.id);
            setFormBuilder(response.data)
        })();
    }, [match]);

    const deleteFormBuilderHandler = (item: any) => {
        (async () => {
            try {
                await deleteFormBuilder(formBuilder);
                history.push('/formBuilder');
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
                    <Link to={'/formBuilder'}>{lang['form-builder']}</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active>
                    {formBuilder.email}
                </Breadcrumb.Item>
            </Breadcrumb>

            <ButtonToolbar className={'actions float-right'} >
                <Button className="btn btn-danger" onClick={handleShowModal}>{lang['delete']} {lang['form-builder']}</Button>
                <Link className="btn btn-primary" to={{pathname: `/formBuilder/edit/${formBuilder.id}`, state: {formBuilder: formBuilder}}}>{lang['edit']} {lang['form-builder']}</Link>
            </ButtonToolbar>
            <h2>{formBuilder.email}</h2>
            <Card>
                <Card.Body>
                    <dl className="row">
                        <dt className="col-sm-3">{lang['form-builder']}:</dt>
                        <dd className="col-sm-9">{formBuilder.email}</dd>
                    </dl>
                </Card.Body>
            </Card>
            <ConfirmDialog item={formBuilder} message={lang['delete'] + " " + lang['form-builder'] + " " + formBuilder.email + " ?"} isDisplay={isDisplayConfirmDelete} onCancelAction={handleCloseModal} onOkAction={deleteFormBuilderHandler} />
        </>
    )
};

export default FormBuilder;
