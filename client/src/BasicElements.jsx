import React from 'react';

class Button extends React.Component {
  render() {
    const icon = "glyphicon glyphicon-" + this.props.icon;

    return (
      <button
        className={this.props.className}
        onClick={this.props.onClick}
        onBlur={this.props.onBlur}>
        <span className={icon}></span>
      </button>
    );
  }
}

class Dropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {isOpen: false};
    this.toggleList = this.toggleList.bind(this);
  }

  toggleList() {
    const newState = this.state.isOpen ? false : true;
    this.setState({isOpen: newState})
  }
  render() {
      return (
        <div id={this.props.wrapper}>
          <Button
            className={this.props.buttonClassName}
            icon={this.props.icon}
            onClick={this.toggleList}
            onBlur={this.state.isOpen && this.toggleList}/>
          {this.state.isOpen && (
              <ul id={this.props.list}>
                <li>jebemtistaru</li>

              </ul>
            )}
        </div>
      );
  }
}

export const Button;
export default Dropdown;
