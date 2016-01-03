import React, { Component, PropTypes } from 'react';

export default class UserChooser extends Component {
  static propTypes = {
    onUserChosen: PropTypes.func.isRequired,
    users: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired).isRequired,
    currentUser: PropTypes.number
  };

  handleChange () {
    this.props.onUserChosen(global.parseInt(this.refs.select.value));
  }

  render () {
    return (
      <select ref='select' onChange={::this.handleChange}>

        {this.props.users.map((user, index) =>
          (<option key={user.id} value={user.id}>{user.name}</option>)
        )}
      </select>
    );
  }
}

