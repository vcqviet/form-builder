import React from 'react';
import {Modal, Button, Form} from 'react-bootstrap';
import {useSelector} from "react-redux";
import {StateInterface} from "../../store/store";
import {Link} from "react-router-dom";

export enum ElementType {
    TEXT = 'TEXT',
    DATE = 'DATE',
    DATE_TIME = 'DATE_TIME',
    FILE = 'FILE',
    CHECKBOX = 'CHECKBOX',
    RADIO = 'RADIO',
    DROPDOWN = 'DROPDOWN',
    BUTTON = 'BUTTON',
    PASSWORD = 'PASSWORD',
    LINK_ACTION = 'LINK_ACTION'
}
export interface ElementOptionInterface {
    value: string;
    text: string;
    selected: boolean;
}
export interface ElementInterface {
    type: string;
    name: string;
    onChange: (value: any) => any;
    className?: string;
    value: string;
    options?: Array<ElementOptionInterface>,
    required?: boolean,
    label?: string,
    clickAction?: (item: any) => any
}

type FormInputModalProps = {
    onOkAction: (item: any) => any,
    onCancelAction: (item: any) => any,
    title: string
    elements: Array<ElementInterface>,
    okText?: string,
    cancelText?: string,
    isDisplay: boolean,
    item: any
}

const FormInputModal: React.FC<FormInputModalProps> = (props) => {
    const lang = useSelector((state: StateInterface) => state.lang);
    const onCloseHandle = () => {
        props.onCancelAction(props.item);
    };
    const onOkHandle = () => {
        props.onOkAction(props.item);
    };
    return (
        <>
            <Modal centered show={props.isDisplay} onHide={onCloseHandle}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.title || lang['input-require']}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {props.elements.map((e: ElementInterface, key) => (
                            <Form.Group key={key}>
                                {e.label && <Form.Label>{e.label || ''}</Form.Label>}
                                {e.type === ElementType.TEXT &&
                                    <Form.Control placeholder={e.label || ''} autoComplete={'off'} required={e.required || false} type={'text'} name={e.name} className={e.className || ''} value={e.value} onChange={event => e.onChange(event.target.value)} ></Form.Control>
                                }
                                {e.type === ElementType.DATE &&
                                    <Form.Control placeholder={e.label || ''} autoComplete={'off'} required={e.required || false} type={'date'} name={e.name} className={e.className || ''} value={e.value} onChange={event => e.onChange(event.target.value)} ></Form.Control>
                                }
                                {e.type === ElementType.PASSWORD &&
                                    <Form.Control placeholder={e.label || ''} autoComplete={'off'} required={e.required || false} type={'password'} name={e.name} className={e.className || ''} value={e.value} onChange={event => e.onChange(event.target.value)} ></Form.Control>
                                }
                                {e.type === ElementType.LINK_ACTION &&
                                    <Link to={'#'} title={e.label || ''} className={e.className || ''} onClick={e.clickAction}>{e.value || lang['click-here']}</Link>
                                }
                            </Form.Group>
                        ))}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onCloseHandle}>
                        {props.cancelText || lang['cancel']}
                    </Button>
                    <Button variant="primary" onClick={onOkHandle}>
                        {props.okText || lang['ok']}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default FormInputModal;
