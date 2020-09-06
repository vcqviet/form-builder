import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import React from 'react';
import {ButtonProps} from 'react-bootstrap';

interface SubmitButtonProps extends ButtonProps {
    loading?: boolean;
    onClick?: any;
}

const LoadingButton: React.FC<SubmitButtonProps> = ({type = 'submit', loading = false, disabled = false, onClick = () => {}, variant = 'primary', children}) => {
    return (
        <Button type={type} disabled={disabled} onClick={onClick} variant={variant}>
            {loading ? <Spinner as={'span'} animation={'border'} size={'sm'} role={'status'} aria-hidden={'true'} /> : <>{children}</>}
        </Button>
    )
};

export default LoadingButton;
