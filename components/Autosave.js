import React from 'react';
import DataService from '../services/DataService'

export default class AutoSave extends React.PureComponent {
  constructor(props) {
    super(props);
    this.wakeSave = this.wakeSave.bind(this);
  }

  componentDidMount() {
    this.handle = setInterval(this.wakeSave, this.props.saveTime * 1000);
  }

  componentDidUpdate(prevProps) {
    if (this.props.saveTime !== prevProps.saveTime) {
      clearInterval(this.handle);
      this.handle = setInterval(this.wakeSave, this.props.saveTime);
    }
  }

  componentWillUnmount() {
    clearInterval(this.handle);
  }

  wakeSave() {
    if (!this.props.saving) {
      return;
    }

    DataService.setData(this.props.transform(this.props.data));
  }

  render() {
    return null;
  }
}