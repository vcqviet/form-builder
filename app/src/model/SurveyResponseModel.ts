import {v4} from 'uuid';
import SurveyModel from './SurveyModel';

class SurveyResponseModel {
    id: string;
    answer: string = '';
    survey?: SurveyModel | null;

    constructor() {
        this.id = v4();
    }
}

export default SurveyResponseModel;
