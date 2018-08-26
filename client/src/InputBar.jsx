import React from 'react';

class InputBar extends React.Component {
  render() {
    const icon = "glyphicon glyphicon-" + this.props.icon;

    return (
      <div className={this.props.className}>
        <div
          className={this.props.highlight}
          >
          <span className={icon}></span>
        </div>
        <input
          className={this.props.highlight}
          type={this.props.type}
          placeholder={this.props.placeholder}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}

export default InputBar;
