import React, {useEffect, useState} from 'react';
import {Form} from 'react-bootstrap';

export class AutoCompleteItem {
    id: string = '';
    text: string = '';
    value: any;
}

class AutoCompleteProps {
    placeholder?: string;
    selected?: AutoCompleteItem;
    className?: string;
    name?: string;
    data: Array<AutoCompleteItem> = [];
    keyword?: string;
    readOnly?: boolean;
    required?: boolean;
    onChange: any;
    onKeywordChange: any;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({onChange, onKeywordChange, ...props}) => {
    const [selectedItem, setSelectedItem] = useState<AutoCompleteItem | null>(props.selected || null);
    const [isFocus, setIsFocus] = useState(false);
    const [isInSelection, setIsInSelection] = useState(false);
    const [keyword, setKeyword] = useState(props.keyword || '');
    const [currentSelectedIndex, setCurrentSelectedIndex] = useState(-1);
    useEffect(() => {
        setKeyword(selectedItem?.text || '');
        onChange(selectedItem || null);
        setCurrentSelectedIndex(-1);
        // eslint-disable-next-line  react-hooks/exhaustive-deps
    }, [selectedItem]);

    useEffect(() => {
        onKeywordChange(keyword);
        setCurrentSelectedIndex(-1);
        // eslint-disable-next-line  react-hooks/exhaustive-deps
    }, [keyword]);

    const onFocusHandle = () => {
        setCurrentSelectedIndex(-1);
        setIsFocus(true);
    };

    const outFocusHandle = (e: any) => {
        setIsFocus(false);
    };

    const onMouseEnterHandle = () => {
        setIsInSelection(true);
    };

    const onMouseLeaveHandle = () => {
        setIsInSelection(false);
    };

    const onKeywordChangeHandle = (e: any) => {
        setKeyword(e.target.value);
    };

    const onSelectHandle = (itemClick: any) => {
        setSelectedItem(itemClick);
    };
    const onKeyDownHandle = (e: any) => {
        if (props.data.length === 0) {
            return;
        }
        //Enter
        if (e.keyCode === 13) {
            e.preventDefault();
            if (currentSelectedIndex > props.data.length - 1 || currentSelectedIndex < 0) {
                return;
            }
            if (!(selectedItem !== null && selectedItem.id === props.data[currentSelectedIndex].id)) {
                setSelectedItem(props.data[currentSelectedIndex]);
            }
            return;
        }
        if (e.keyCode !== 38 && e.keyCode !== 40) {
            return;
        }
        let navigate = -1;
        //ArrowDown 
        if (e.keyCode === 40) {
            navigate = 1;
        }
        setCurrentSelectedIndex(Math.min(Math.max(currentSelectedIndex + navigate, 0), props.data.length - 1));

    };
    return (
        <div className={'app-auto-complete'}>
            <Form.Control onKeyDown={onKeyDownHandle} readOnly={props.readOnly || false} autoComplete="off" key={props.name + '-auto-complete'}
                value={keyword} type={'text'} placeholder={props.placeholder || ''} onBlur={outFocusHandle}
                onChange={onKeywordChangeHandle} className={props.className} name={props.name}
                onFocus={onFocusHandle}
                required={props.required || false} />
            {(isFocus || isInSelection) && props.data.length > 0 && !props.readOnly &&
                <div className={'list-select'} onMouseLeave={onMouseLeaveHandle} onMouseEnter={onMouseEnterHandle}>
                    <ul>
                        {props.data.map((item, index) => <li className={index === currentSelectedIndex ? 'active' : ''} key={item.id} onClick={e => onSelectHandle(item)}>{item.text}</li>)}
                    </ul>
                </div>
            }
        </div>
    );
};
export default AutoComplete;
