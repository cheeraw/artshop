import React from 'react';
import Dropdown from './Dropdown.jsx';
import Button from './Button.jsx';

class NavBar extends React.Component {
  render() {
    return (
      <div id="navigation-bar">
        <Button className="sidebar-button" icon="menu-hamburger" />
        <Brand />
        <SearchForm />
        <Dropdown
          toggleLogin={this.props.toggleLogin}
          userLoggedIn={this.props.userLoggedIn}
          buttonClassName="userbutton"
          icon="user"
          wrapper="user-dropdown"
          list="user-dropdown-list" />
      </div>
    );
  }
}

class SearchForm extends React.Component {
  render() {
    return (
      <form>
        <input id="searchbar" type="text" placeholder="search..."/>
        <Button className="searchbutton" type="submit" icon="search"/>
      </form>
    );
  }
}

class Brand extends React.Component {
  render() {
    return (
      <div id="brand">
        artshop
      </div>
    );
  }
}

export default NavBar;
