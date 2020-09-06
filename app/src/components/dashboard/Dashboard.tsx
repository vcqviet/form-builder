import React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {StateInterface} from '../../store/store';
import {Card, Container} from 'react-bootstrap';

const Dashboard: React.FC<RouteComponentProps> = ({match, history}) => {
    const lang = useSelector((state: StateInterface) => state.lang);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
   

    return (
        <Container>
            <Card>
                <Card.Body>
                    <h1>{lang['welcome']}</h1>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Dashboard;
