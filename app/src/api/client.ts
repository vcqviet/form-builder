import UserModel, {UserRole} from '../model/UserModel';
import {getUser} from './user/userApi';

interface Credentials {
    username: string;
    password: string;
}

enum HttpMethods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}

class Session {
    token: string = '';
    refreshToken: string = '';
    user = new UserModel();

    constructor() {
        this.loadToken();
    }

    loadToken() {
        if (localStorage.getItem('session')) {
            const sess = JSON.parse(localStorage.session);
            this.token = sess.token;
            this.refreshToken = sess.refreshToken;
            this.user = sess.user;
        }
    }

    authorization() {
        this.loadToken();
        return {Authorization: `Bearer ${this.token}`};
    }

    set(token: string, refreshToken: string, user: UserModel) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.user = user;
        localStorage.setItem('session', JSON.stringify(this));
    }

    clear() {
        this.set('', '', new UserModel());
    }
}

class ApiClient {
    private session: Session;
    private readonly baseUrl: string;

    constructor(baseUrl: string, session: Session) {
        this.baseUrl = baseUrl.replace(/\/$/, '');
        this.session = session;
    }
    async get(endpoint: string, headerContentType = 'application/json') {
        return await this.request(HttpMethods.GET, endpoint, undefined, headerContentType);
    }
    async post(endpoint: string, payload?: any) {
        return await this.request(HttpMethods.POST, endpoint, payload);
    }
    async put(endpoint: string, payload: any) {
        return await this.request(HttpMethods.PUT, endpoint, payload);
    }
    async patch(endpoint: string, payload: any) {
        return await this.request(HttpMethods.PATCH, endpoint, payload);
    }
    async delete(endpoint: string) {
        return await this.request(HttpMethods.DELETE, endpoint);
    }

    isLoggedIn(): boolean {
        return Boolean(this.session.token);
    }
    getUser(): UserModel {
        return this.session.user;
    }
    isAdmin(): boolean {
        const user = this.getUser();
        return user && user.roles.find(item => item === UserRole.ROLE_ADMIN) !== undefined;
    }

    logout() {
        this.session.clear();
    }
    async login(credentials: Credentials) {
        const response = await fetch(this.absUrl('/login_check'), {
            method: HttpMethods.POST,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(credentials),
        });
        if (!response.ok) {
            const msg = response.status === 401 ? 'Invalid username or password' : 'Something has gone wrong, please try again';
            throw Error(`Login failed: ${msg}`);
        }
        const json = await response.json();
        this.session.set(json.token, json.refreshToken, new UserModel());
        const responseUser = await getUser('me');
        this.session.set(json.token, json.refreshToken, responseUser.data);
    }

    async requestPasswordReset(email: string) {
        const response = await fetch(this.absUrl('/password-reset-request'), {
            method: HttpMethods.POST,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email: email}),
        });
        if (!response.ok) {
            throw Error(`Password reset request failed: ${response.statusText}`);
        }
    }

    async resetPassword(token: string, password: string) {
        const response = await fetch(this.absUrl('/password-reset'), {
            method: HttpMethods.POST,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({token: token, password: password}),
        });

        if (!response.ok) {
            let responseBody = null;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                responseBody = await response.json();
            }
            const message = responseBody && responseBody.message ? responseBody.message : response.statusText;
            throw Error(`Password reset failed: ${message}`);
        }
    }

    private absUrl(path: string): string {
        const sep = path[0] === '/' ? '' : '/';
        return `${this.baseUrl}${sep}${path}`;
    }

    private async refresh() {
        const response = await fetch(this.absUrl('/token/refresh'), {
            method: HttpMethods.POST,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: 'refreshToken=' + this.session.refreshToken,
        });

        if (response.ok) {
            const json = await response.json();
            this.session.set(json.token, json.refreshToken, this.getUser());
            const responseUser = await getUser('me');
            this.session.set(json.token, json.refreshToken, responseUser.data);
        } else if (response.status === 401) {
            this.logout();
            window.location.reload();
        } else {
            throw Error(`API Request failed: ${response.statusText}`);
        }
    }

    private async request(method: HttpMethods, endpoint: string, body = undefined, headerContentType: string = 'application/json') {
        let response = await fetch(this.absUrl(endpoint), {
            method: method,
            headers: {...this.session.authorization(), 'Content-Type': headerContentType},
            body: JSON.stringify(body),
        });

        if (response.status === 401) {
            await this.refresh();
            response = await fetch(this.absUrl(endpoint), {
                method: method,
                headers: {...this.session.authorization(), 'Content-Type': headerContentType},
                body: JSON.stringify(body),
            });
        }

        let responseBody = null;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            responseBody = await response.json();
        } else if (contentType && contentType.includes('text/csv')) {
            responseBody = await response.text();
        }

        if (!response.ok) {
            const message = responseBody && responseBody.message ? responseBody.message : response.statusText;
            throw Error(`Request failed: ${message}`);
        }

        return responseBody;
    }
}

export default new ApiClient(process.env.REACT_APP_API_BASE_URL || '', new Session());
