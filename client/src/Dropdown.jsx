import React from 'react';
import Button from './Button.jsx';

class Dropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {isOpen: false};
    this.toggleList = this.toggleList.bind(this);
    this.handleClickLogin = this.handleClickLogin.bind(this);
  }

  toggleList() {
    const newState = this.state.isOpen ? false : true;
    this.setState({isOpen: newState})
  }

  handleClickLogin() {
    this.toggleList();
    this.props.toggleLogin();
  }

  render() {
      let list;

      if(this.props.userLoggedIn) {
        list = (
          <ul>
          </ul>
        );
      } else {
        list = (
          <div>
            <Button onClick={this.handleClickLogin} value="  log in" icon="log-in" />
            <Button onClick={this.props.toggleRegister} value="  register" icon="pencil" />
          </div>
        );
      }
      return (
        <div id={this.props.wrapper}>
          <Button
            className={this.props.buttonClassName}
            icon={this.props.icon}
            onClick={this.toggleList}
          />
          {this.state.isOpen && list}
        </div>
      );
  }
}

export default Dropdown;
