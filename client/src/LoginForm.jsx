import React from 'react';
import Button from './Button.jsx';
import InputBar from './InputBar.jsx';
import { regex } from './functions/validations.js';

const request = require('superagent');

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputType: "password",
      icon: "eye-close",
      highlight: ""
   }
    this.toggleMask = this.toggleMask.bind(this);
    this.toggleHighlight = this.toggleHighlight.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  toggleMask() {
    const newState = this.state.inputType === "password" ? ["text","eye-open"] : ["password","eye-close"];

    this.setState({
      inputType: newState[0],
      icon: newState[1]
    });
  }

  toggleHighlight(type) {
    if(typeof type !== 'undefined') {
      this.setState({ highlight: type});
    } else {
      this.setState({ highlight: ""});
    }
  }

  handleChange(e, type) {
    var str = e.target.value;
    str = str.replace(regex(type), '');
    e.target.value = str;

    switch(type) {
      case "basic":
        this.setState({username: str});
        break;
      case "password":
        this.setState({password: str});
    }
  }

  onSubmit() {
    var url = "http://localhost:5000/login";

    var params = {
      username: this.state.username,
      password: this.state.password
    };

    request
      .post(url)
      .type('form')
      .send(params)
      .end((err, res) => {
      // Calling the end function will send the request
        try {
          if (res.body.message === "LoginSuccess") {
            console.log("success");
            this.setState({success: true});
            setTimeout(() => {
              this.props.toggle();
            }, 2000);
          }
          else {
            this.setState({success: false});
            console.log("failed");
          }
          console.log(res);
        } catch (error) {
          throw(error);
        }
      });
  }

  render() {
    return (
      <div className="form-wrapper">
        {this.state.success ?
        <div className="center-wrapper">
        <div className="success-text">
          login successful
        </div>
        </div> :
        <div className="center-wrapper">
          <Button
            className="closeButton"
            icon="remove"
            onClick={this.props.toggle}
          />
          <InputBar
            className="bar"
            type="text"
            icon="user"
            placeholder="username..."
            highlight={this.state.highlight === "user" && "highlight"}
            onFocus={() => this.toggleHighlight("user")}
            onBlur={this.toggleHighlight}
            onChange={(e) => this.handleChange(e, "basic")}
          />
          <InputBar
            className="bar password-wrapper"
            type={this.state.inputType}
            icon="lock" placeholder="password..."
            highlight={this.state.highlight === "pass" && "highlight"}
            onFocus={() => this.toggleHighlight("pass")}
            onBlur={this.toggleHighlight}
            onChange={(e) => this.handleChange(e, "password")}
          />
          <Button className="maskButton" onClick={this.toggleMask} icon={this.state.icon}/>
          <input type="checkbox" className="rememberMe"/>
          <p>remember me</p>
          <a href="#">forgot password?</a>
          <Button
            className="confirm"
            value="log in"
            icon="log-in"
            onClick={this.onSubmit}/>
        </div>}
      </div>
    );
  }
}

export default LoginForm;
