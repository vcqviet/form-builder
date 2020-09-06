import React, {useEffect, useState} from 'react';
import {Badge, Form} from 'react-bootstrap';

export class SearchMultiSelectionItem {
    id: string = '';
    text: string = '';
    value: any;
}

type SearchMultiSelectionProps = {
    placeholder?: string;
    selected?: Array<SearchMultiSelectionItem>;
    className?: string;
    name?: string;
    onChange?: any;
    data?: Array<SearchMultiSelectionItem>;
}

const SearchMultiSelection: React.FC<SearchMultiSelectionProps> = (props) => {
    const [selectedItems, setSelectedItems] = useState<Array<SearchMultiSelectionItem>>(props.selected || []);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [data, setData] = useState<Array<SearchMultiSelectionItem>>(props.data || []);
    const [isFocus, setIsFocus] = useState(false);
    const [isInSelection, setIsInSelection] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [currentSelectedIndex, setCurrentSelectedIndex] = useState(-1);

    const onFocusHandle = () => {
        setIsFocus(true);
    };

    useEffect(() => {
        setKeyword('');
        props.onChange(selectedItems);
        setCurrentSelectedIndex(-1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedItems]);

    const outFocusHandle = () => {
        setCurrentSelectedIndex(-1);
        setIsFocus(false);
    };

    const onMouseEnterHandle = () => {
        setIsInSelection(true);
    };

    const onMouseLeaveHandle = () => {
        setIsInSelection(false);
    };

    const onKeywordChangeHandle = (e: any) => {
        setCurrentSelectedIndex(-1);
        setKeyword(e.target.value);
    };

    const onSelectHandle = (itemClick: any) => {
        if (selectedItems.filter(item => item.id === itemClick.id).length === 0) {
            selectedItems.push(itemClick);
            setSelectedItems(selectedItems.map(item => item));
        }
    };

    const onRemoveHandle = (itemClick: any) => {
        if (selectedItems.filter(item => item.id === itemClick.id).length > 0) {
            setSelectedItems(selectedItems.filter(item => item.id !== itemClick.id));
        }
    };

    const onKeyDownHandle = (e: any) => {
        let filterData = data.filter(item => (item.id.toLocaleLowerCase().indexOf(keyword.toLocaleLowerCase()) >= 0 && selectedItems.filter(select => select.id === item.id).length === 0));
        if (filterData.length === 0) {
            return;
        }
        //Enter
        if (e.keyCode === 13) {
            e.preventDefault();
            if (currentSelectedIndex > filterData.length - 1 || currentSelectedIndex < 0) {
                return;
            }
            let seletectItem = filterData[currentSelectedIndex];
            if (selectedItems.filter(item => item.id === seletectItem.id).length === 0) {
                selectedItems.push(seletectItem);
                setSelectedItems(selectedItems.map(item => item));
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
        setCurrentSelectedIndex(Math.min(Math.max(currentSelectedIndex + navigate, 0), filterData.length - 1));
    };
    return (
        <div className={'app-multi-select'}>
            <div className={'form-control'}>
                {selectedItems.map(item =>
                    <Badge key={item.id} variant={'info'} onClick={(e: any) => onRemoveHandle(item)}>{item.text}
                        <span className={'fa fa-cancel'}>&times;</span>
                    </Badge>
                )}
                <Form.Control onKeyDown={onKeyDownHandle} autoComplete="off" value={keyword} type={'text'} placeholder={props.placeholder}
                    onBlur={outFocusHandle} onChange={onKeywordChangeHandle} className={props.className}
                    name={props.name} onFocus={onFocusHandle} />
            </div>
            {(isFocus || isInSelection) && selectedItems.length < data.length &&
                <div className={'list-select'} onMouseLeave={onMouseLeaveHandle} onMouseEnter={onMouseEnterHandle}>
                    <ul>
                    {data.filter(item => (item.id.toLocaleLowerCase().indexOf(keyword.toLocaleLowerCase()) >= 0 && selectedItems.filter(select => select.id === item.id).length === 0)).map((item, index) =>
                            <li className={index === currentSelectedIndex ? 'active' : ''} key={item.id} onClick={e => onSelectHandle(item)}>{item.text}</li>)}
                    </ul>
                </div>
            }
        </div>
    );
};
export default SearchMultiSelection;
