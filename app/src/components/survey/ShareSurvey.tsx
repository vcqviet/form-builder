import React, {useEffect, useState} from 'react';
import {RouteComponentProps} from 'react-router';
import {Card} from 'react-bootstrap';
import SurveyModel from '../../model/SurveyModel';

const ShareSurvey: React.FC<RouteComponentProps<{id: string}>> = ({match}) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [survey, setSurvey] = useState(new SurveyModel());

    useEffect(() => {
        (async () => {
            // TODO get data from API and render it
        })();
    }, [match]);

    return (
        <>
            <h2>{survey.title}</h2>
            <Card>
                <Card.Body>
                    TODO: render form from api
                </Card.Body>
            </Card>
        </>
    )
};

export default ShareSurvey;
