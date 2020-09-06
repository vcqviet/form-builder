import React, {useState} from 'react'
import {Navbar, Row, Col, ListGroup, Collapse, Button, Badge, OverlayTrigger, Popover} from 'react-bootstrap';
import client from '../../api/client';
import {Link} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {StateInterface} from '../../store/store';
import {faCaretDown, faBirthdayCake} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
const TopBar: React.FC = () => {
    const lang = useSelector((state: StateInterface) => state.lang);
    const [isDisplay, setIsDisplay] = useState(false);

    
    const overPlayBirthDay = (
        <Popover id={'overPlayBirthDay'}>
            <Popover.Title as="h3">{lang['birthday']} {lang['customer']}</Popover.Title>
            <Popover.Content className={'p-0'}>
                <ListGroup className={'border-0'}>
                    
                </ListGroup>
            </Popover.Content>
        </Popover >
    );
    
    const onMouseLeaveTopBar = () => {
        setIsDisplay(false);
    }
    return (
        <header className={'top-bar p-1 pl-5 pr-5 fixed-top'}>
            <Row onMouseLeave={(e: any) => onMouseLeaveTopBar()}>
                <Col xs lg={{span: 5}}>
                    <Navbar.Brand href="" target={'_blank'}>Logo</Navbar.Brand>
                </Col>
                <Col xs lg={{span: 7, offset: 0}}>
                    <div className={'text-right'}>
                        <Row>
                            <Col xs lg={{span: 8}} className={'p-0 pt-1'}>
                                <OverlayTrigger trigger="click" placement={'bottom'} overlay={overPlayBirthDay} rootClose={true}>
                                    <Button variant="secondary" className={'mr-1'}>
                                        <FontAwesomeIcon icon={faBirthdayCake} />
                                        <sup><Badge variant="danger">1</Badge></sup>
                                    </Button>
                                </OverlayTrigger>
                                
                            </Col>
                            <Col xs lg={{span: 4}} className={'p-0 pt-1 text-left'}>
                                <Link to={'#'} className={'text-white btn btn-primary'} onClick={e => setIsDisplay(!isDisplay)}> {client.getUser()?.email || ''} <FontAwesomeIcon icon={faCaretDown} /></Link>
                                <Collapse in={isDisplay}>
                                    <ListGroup className={'position-fixed'}>
                                        <ListGroup.Item><Link to={{pathname: `/profile`, state: {profileId: client.getUser().id}}}>{lang['profile']}</Link></ListGroup.Item>
                                        <ListGroup.Item><Link to={{pathname: `/change-password`, state: {profileId: client.getUser().id}}}>{lang['change-password']}</Link></ListGroup.Item>
                                        <ListGroup.Item><Link to={'/login'}>{lang['logout']}</Link></ListGroup.Item>
                                    </ListGroup>
                                </Collapse>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </header >
    );
};

export default TopBar;
