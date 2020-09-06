
import vi from '../../material/i18n/vi.json';
import en from '../../material/i18n/en.json';

const initialState = {
    vi: vi,
    en: en
};

interface I18nAction {
    lang: string;
}

const i18nReducer = (state = initialState, action: I18nAction) => {
    switch (action.lang) {
        case 'vi': return vi;
        default: return en;
    }
};

export default i18nReducer;
