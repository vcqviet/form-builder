import {v4} from 'uuid';

export enum FormElementType {
    TEXT = 'TEXT',
    RADIO = 'RADIO',
    CHECKBOX = 'CHECKBOX',
    DROPDOWN = 'DROPDOWN',
    STATIC = 'STATIC'
}
export class FormElementOption {
    text: string = '';
    value: string = '';
}
export class FormElement {
    elementType: string = FormElementType.TEXT;
    label: string = '';
    response: string = '';
    options: Array<FormElementOption> = [];
}
export class JsonFormat {
    title: string = '';
    subTitle: string = '';
    note: string = '';
    elements: Array<FormElement> = [];
}

class FormBuilderModel {
    id: string;
    email: string = '';
    jsonFormat: string = '';

    constructor() {
        this.id = v4();
    }
}

export default FormBuilderModel;
