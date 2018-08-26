import React from 'react';

class Button extends React.Component {
  render() {
    const icon = "glyphicon glyphicon-" + this.props.icon;

    return (
      <button
        className={this.props.className}
        onClick={this.props.onClick}
        onBlur={this.props.onBlur}>
        <span className={icon}></span>{this.props.value}
      </button>
    );
  }
}

export default Button;
