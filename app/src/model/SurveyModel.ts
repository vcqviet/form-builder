import {v4} from 'uuid';
import QuestionModel from './QuestionModel';
import SurveyResponseModel from './SurveyResponseModel';

export enum SurveyStatus {
    STATUS_OPEN = 'STATUS_OPEN',
    STATUS_CLOSED = 'STATUS_CLOSED'
}

class SurveyModel {
    id: string;
    email: string = '';
    title: string = '';
    description: string = '';
    note: string = '';
    status: string = SurveyStatus.STATUS_OPEN;
    questions: Array<QuestionModel> = []
    surveyResponses: Array<SurveyResponseModel> = [];
    constructor() {
        this.id = v4();
    }
}

export default SurveyModel;
