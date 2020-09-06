import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import {useSelector} from "react-redux";
import {StateInterface} from "../../store/store";


type ConfirmDialogProps = {
    message: string;
    onOkAction: (item: any) => any;
    onCancelAction: (item: any) => any;
    okText?: string,
    cancelText?: string,
    confirmText?: string,
    item: any,
    isDisplay: boolean
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = (props) => {
    const lang = useSelector((state: StateInterface) => state.lang);
    const onCloseHandle = () => {
        props.onCancelAction(props.item);
    }
    const onOkHandle = () => {
        props.onOkAction(props.item);
    }
    return (
        <>
            <Modal show={props.isDisplay} onHide={onCloseHandle}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.confirmText || lang['confirm']}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{props.message}</Modal.Body>
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

export default ConfirmDialog;
