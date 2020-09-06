import React, {useState, useRef} from 'react';

import {Overlay, Tooltip} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEllipsisV} from '@fortawesome/free-solid-svg-icons';
import {IconProp} from '@fortawesome/fontawesome-svg-core';

export interface MenuIconInterface {
    text: string;
    icon: IconProp;
    action: (entity: any) => any;
}
type ThreedotsMenuProps = {
    menu: Array<MenuIconInterface>,
    entity: any
}

const ThreedotsMenu: React.FC<ThreedotsMenuProps> = (props: ThreedotsMenuProps) => {
    const [isDislay, setIsDisplay] = useState(false);
    const target = useRef(null);
    const menuList = props.menu || [];

    return (<>
        {menuList.length > 0 &&
            <>
                <div className={'threedot'} ref={target} onClick={() => setIsDisplay(!isDislay)}>
                    <FontAwesomeIcon icon={faEllipsisV} />
                </div>
                <Overlay target={target.current} show={isDislay} placement={'bottom-end'} >
                    {(propsOver: any) => (
                        <Tooltip id={'threedot-content'} {...propsOver} onMouseLeave={e => setIsDisplay(false)}>
                            <ul className={'threedot-menu-content'}>
                                {menuList.map((menu, k) =>
                                    <li className={'text-left'} key={k} onClick={() => {setIsDisplay(false); menu.action(props.entity)}} title={menu.text}><FontAwesomeIcon icon={menu.icon} /> {menu.text}</li>
                                )}
                            </ul>
                        </Tooltip>
                    )}
                </Overlay>
            </>
        }
    </>
    );
};

export default ThreedotsMenu;
