import React from 'react';
import { StyleSheet, View } from 'react-native';
import AnimatedBar from 'react-native-animated-bar';

import { flexItem, verticalCenter } from '../CommonStyles';
import Row from './Row';
import TheDirt from './TheDirt';

export default class DirtRow extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Row>
        <TheDirt disabled={this.props.disabled} onPress={this.props.onPressDirt}/>    
        <View style={[styles.flexItem, styles.verticalCenter]}>
          <AnimatedBar duration={50} progress={this.props.progress} />
        </View>
      </Row>
    )
  }
};

const styles = StyleSheet.create({
  flexItem,
  verticalCenter
});