import React from 'react';
import NavBar from './NavBar.jsx';
import LoginForm from './LoginForm.jsx';
import RegistrationForm from './RegistrationForm.jsx';
import './css/forms.css';
import './css/navbar.css';
//import 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loginForm: false,
      registrationForm: true,
      userLoggedIn: false
    }

    this.toggleLoginForm = this.toggleLoginForm.bind(this);
    this.toggleRegistrationForm = this.toggleRegistrationForm.bind(this);
  }

  toggleLoginForm() {
    const newState = this.state.loginForm ? false : true;

    this.setState({loginForm: newState});
  }

  toggleRegistrationForm() {
    const newState = this.state.registrationForm ? false : true;

    this.setState({registrationForm: newState});
  }
  render() {
    return (
      <div>
        <NavBar
          userLoggedIn={this.state.userLoggedIn}
          toggleLogin={this.toggleLoginForm}
          toggleRegistration={this.toggleRegistrationForm}/>
        {this.state.loginForm && <LoginForm toggle={this.toggleLoginForm}/>}
        {this.state.registrationForm && <RegistrationForm toggle={this.toggleRegistrationForm} toggleLogin={this.toggleLoginForm}/>}
      </div>
    );
  }
}

export default App;
