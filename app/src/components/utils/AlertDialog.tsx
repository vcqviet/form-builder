import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import {useSelector} from "react-redux";
import {StateInterface} from "../../store/store";


type AlertDialogProps = {
    message: string;
    title?: string,
    onCloseAction: (item: any) => any;
    okText?: string,
    item: any,
    isDisplay: boolean
}

const AlertDialog: React.FC<AlertDialogProps> = (props) => {
    const lang = useSelector((state: StateInterface) => state.lang);

    const onOkHandle = () => {
        props.onCloseAction(props.item);
    };
    return (
        <>
            <Modal show={props.isDisplay} onHide={onOkHandle}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.title || lang['confirm']}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{props.message}</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={onOkHandle}>
                        {props.okText || lang['ok']}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AlertDialog;
