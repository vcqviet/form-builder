import React from 'react';
import {Row, Col, Pagination as Paginator} from 'react-bootstrap';

export class PaginationFilter {
    page = 1;
    limit = 100;
    constructor(page = 1, limit = 100) {
        this.page = page;
        this.limit = limit;
    }
}

class PaginationProps {
    pagination?: PaginationFilter = new PaginationFilter();
    onClickHandle: any;
    maxPage?: number = 0;
}

const Pagination: React.FC<PaginationProps> = ({onClickHandle, pagination, maxPage}) => {

    const onPrevClickHandle = () => {
        if (pagination && pagination.page > 1) {
            pagination.page -= 1;
        }
        onClickHandle(pagination);
    };
    const onNextClickHandle = () => {
        if (pagination && (maxPage === undefined || maxPage === 0 || pagination.page < maxPage)) {
            pagination.page += 1;
        }
        onClickHandle(pagination);
    };
    return (
        <Row>
            <Col md={{span: 4, offset: 8}}>
                <Paginator style={{float: 'right'}}>
                    <div onClick={onPrevClickHandle}><Paginator.Prev /></div>
                    <div><Paginator.Item>{pagination?.page || 1}</Paginator.Item></div>
                    <div onClick={onNextClickHandle}><Paginator.Next /></div>
                </Paginator>
            </Col>
        </Row>
    );
};
export default Pagination;
