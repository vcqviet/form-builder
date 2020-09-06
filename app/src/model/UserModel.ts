import {v4} from 'uuid';

export enum UserRole {
    ROLE_USER = 'ROLE_USER',
    ROLE_ADMIN = 'ROLE_ADMIN',
    ROLE_STAFF = 'ROLE_STAFF',
}

class UserModel {
    id: string;
    email: string = '';
    roles: Array<string> = [];
    firstName: string = '';
    lastName: string = '';
    fullName: string = '';
    phone?: string;
    password?: string;

    constructor() {
        this.id = v4();
    }
}

export default UserModel;
