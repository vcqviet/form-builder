import React from 'react';
import {BrowserRouter as Router, Route, NavLink, Switch} from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Error from './components/utils/Error';
import UserLogin from './components/auth/UserLogin';
import AuthorisedRoute from './components/auth/AuthorisedRoute';
import Dashboard from './components/dashboard/Dashboard';
import Users from './components/user/Users';
import PasswordReset from './components/auth/ResetPassword';
import {useSelector} from 'react-redux';
import {StateInterface} from './store/store';
import TopBar from './components/utils/TopBar';
import Profile from './components/user/Profile';
import ChangePassword from './components/user/ChangePassword';
import Surveys from './components/survey/Surveys';

const AdminApp: React.FC = () => {
    const lang = useSelector((state: StateInterface) => state.lang);

    return (
        <Router basename={'/'} >
            <div className={'app'}>
                <TopBar />
                <div className={'nav-col'}>
                    <Navbar variant={'dark'} collapseOnSelect expand={'lg'}>
                        <Navbar.Toggle aria-controls={'responsive-navbar-nav'} />
                        <Navbar.Collapse id={'responsive-navbar-nav'}>
                            <Nav variant={'pills'} className={'flex-column'}>
                                <Nav.Link as={NavLink} to={'/dashboard'}>{lang['dashboard']}</Nav.Link>
                                <Nav.Link as={NavLink} to={'/survey'}>{lang['menu-survey']}</Nav.Link>
                                <Nav.Link as={NavLink} to={'/user'}>{lang['menu-user']}</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
                <div className={'app-col'}>
                    <Container>
                        <Error />
                        <Switch>
                            <Route path={'/login'} component={UserLogin} />
                            <Route exact path={'/password-reset/:token'} component={PasswordReset} />
                            <AuthorisedRoute path={'/survey'} component={Surveys} />
                            <AuthorisedRoute path={'/user'} component={Users} />
                            <AuthorisedRoute path={'/profile'} component={Profile} />
                            <AuthorisedRoute path={'/change-password'} component={ChangePassword} />
                            <AuthorisedRoute path={'/'} component={Dashboard} />
                        </Switch>
                    </Container>
                </div>
            </div>
        </Router>
    );
};

export default AdminApp;
