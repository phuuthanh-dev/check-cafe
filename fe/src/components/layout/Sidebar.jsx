import React, { useState } from 'react';
import * as Icons from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {logout} from '../../store/slices/authenticationSlice.jsx';
import { adminNavigation, shopNavigation } from './../../apis/navigation';
import { USER_ROLE } from '../../utils/constant.js';
const Sidebar = () => {
  const [toggle, setToggle] = useState(null);
  const [sidebar, setSidebar] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.authentication.user);

  // Determine navigation list based on user role
  const navigationList = user?.role === USER_ROLE.ADMIN ? adminNavigation : shopNavigation;

  const handleManu = (key) => {
    setToggle((prevToggle) => (prevToggle === key ? null : key));
  };

  const handleSidebar = () => {
    setSidebar(!sidebar);
  };

  const handleIsLogout = () => {
    dispatch(logout());
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <div className={`sidemenu ${sidebar ? 'active' : ''}`}>
      {/* Admin User */}
      <div className="sidebar_profile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px' }}>

        <h2 className="logo_text">{user?.role === USER_ROLE.ADMIN ? 'Admin Panel' : 'Shop Panel'}</h2>
        <Link className="navbar_icon menu_sidebar" onClick={handleSidebar}>
          <Icons.TbChevronsLeft className={`${sidebar ? 'active' : ''}`} />
        </Link>
      </div>
      {/* menu links */}
      <ul className="menu_main">
        {navigationList.map(function (navigationItem, key) {
          return (
            <li key={key}>
              {!navigationItem.subMenu ? (
                <NavLink
                  to={`${navigationItem.url}`}
                  className={`menu_link ${toggle === key ? 'active' : ''}`}
                  onClick={() => handleManu(key)}
                >
                  {navigationItem.icon}
                  <span>{navigationItem.name}</span>
                  {navigationItem.subMenu ? <Icons.TbChevronDown /> : ''}
                </NavLink>
              ) : (
                <div className="menu_link" onClick={() => handleManu(key)}>
                  {navigationItem.icon}
                  <span>{navigationItem.name}</span>
                  {navigationItem.subMenu ? <Icons.TbChevronDown /> : ''}
                </div>
              )}
              {navigationItem.subMenu ? (
                <ul className={`sub_menu ${toggle === key ? 'active' : ''}`}>
                  {navigationItem.subMenu &&
                    navigationItem.subMenu.map(function (subNavigationItem, subKey) {
                      return (
                        <li key={subKey}>
                          <NavLink
                            to={`${navigationItem.url}${subNavigationItem.url}`}
                            className="menu_link"
                          >
                            {subNavigationItem.icon}
                            <span>{subNavigationItem.name}</span>
                            {subNavigationItem.subMenu ? <Icons.TbChevronDown /> : ''}
                          </NavLink>
                        </li>
                      );
                    })}
                </ul>
              ) : (
                ''
              )}
            </li>
          );
        })}
        <div
          className={`menu_link`}
          onClick={handleIsLogout}
        >
          <Icons.TbLogout className="menu_icon" />
          <span>Logout</span>
        </div>
      </ul>
    </div>
  );
};

export default Sidebar;