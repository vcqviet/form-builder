import {v4} from 'uuid';
import QuestionModel from './QuestionModel';
import SurveyResponseModel from './SurveyResponseModel';

class SurveyModel {
    id: string;
    email: string = '';
    title: string = '';
    description: string = '';
    note: string = '';
    questions: Array<QuestionModel> = []
    surveyResponse: Array<SurveyResponseModel> = [];
    constructor() {
        this.id = v4();
    }
}

export default SurveyModel;
