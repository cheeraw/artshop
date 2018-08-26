import React from 'react';
import Button from './Button.jsx';
import InputBar from './InputBar.jsx';

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

  render() {
    return (
      <div className="form-wrapper">
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
          />
          <InputBar
            className="bar password-wrapper"
            type={this.state.inputType}
            icon="lock" placeholder="password..."
            highlight={this.state.highlight === "pass" && "highlight"}
            onFocus={() => this.toggleHighlight("pass")}
            onBlur={this.toggleHighlight}
          />
          <Button className="maskButton" onClick={this.toggleMask} icon={this.state.icon}/>
          <input type="checkbox" className="rememberMe"/>
          <p>remember me</p>
          <a href="#">forgot password?</a>
          <Button className="confirm" value="log in" icon="log-in"/>
        </div>
      </div>
    );
  }
}

export default LoginForm;
