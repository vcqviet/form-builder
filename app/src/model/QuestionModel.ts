import {v4} from 'uuid';
import SurveyModel from './SurveyModel';
import OptionModel from './OptionModel';

export enum QuestionType {
    TYPE_INPUT_TEXT = 'TYPE_INPUT_TEXT',
    TYPE_INPUT_RADIO = 'TYPE_INPUT_RADIO',
    TYPE_INPUT_CHECKBOX = 'TYPE_INPUT_CHECKBOX',
    TYPE_DROPDOWN_BOX = 'TYPE_DROPDOWN_BOX',
    TYPE_INPUT_TEXT_AREA = 'TYPE_INPUT_TEXT_AREA'
}
class QuestionModel {
    id: string;
    label: string = '';
    type: string = QuestionType.TYPE_INPUT_TEXT;
    survey?: SurveyModel | null;
    options: Array<OptionModel> = [];
    note: string = '';


    constructor() {
        this.id = v4();
    }
}

export default QuestionModel;
