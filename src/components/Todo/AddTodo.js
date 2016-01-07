import React, { findDOMNode, Component, PropTypes } from 'react';

export default class AddTodo extends Component {

  handleClick (event) {
    const node = findDOMNode(this.refs.input);
    const text = node.value.trim();
    this.props.onAddClick(text);
    node.value = '';
  }

  render () {
    return (
      <div>
        <input type="text" ref="input" />
        <button onClick={(event) => this.handleClick(event)}>
          Add
        </button>
      </div>
    );
  }
}

AddTodo.propTypes = {
  onAddClick: PropTypes.func.isRequired
};
