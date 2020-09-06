import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSortAlphaUp, faSortAlphaDown, faSort} from '@fortawesome/free-solid-svg-icons';

export class HeaderSortItem {
    text: string = '';
    column: string = '';
    isSortable?: boolean = false;
}

export class SortOrderBy {
    column: string = '';
    isAsc: boolean = true;
    constructor(column: string, isAsc: boolean = true) {
        this.column = column;
        this.isAsc = isAsc;
    };
}

class SortOrderProps {
    sortBy?: SortOrderBy;
}
const SortOrder: React.FC<SortOrderProps> = (props) => {
    if (!props.sortBy) {
        return <FontAwesomeIcon icon={faSort} />;
    }
    if (props.sortBy.isAsc) {
        return <FontAwesomeIcon icon={faSortAlphaDown} />;
    }
    return <FontAwesomeIcon icon={faSortAlphaUp} />;
}
export default SortOrder;