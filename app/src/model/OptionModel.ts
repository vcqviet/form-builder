import {v4} from 'uuid';
import QuestionModel from './QuestionModel';

class OptionModel {
    id: string;
    text: string = '';
    value: string = '';
    question?: QuestionModel | null;

    constructor() {
        this.id = v4();
    }
}

export default OptionModel;
