import {PaginationFilter} from '../../../components/utils/Pagination';
import {SortOrderBy} from '../../../components/utils/SortOrder';


class MasterFilter {
    keyword?: string;
    pagination?: PaginationFilter = new PaginationFilter();
    sortBy: Array<SortOrderBy> = [];
}

export default MasterFilter;
