import React from 'react';
import { StyleSheet, View } from 'react-native';
import AnimatedBar from 'react-native-animated-bar';

import { flexItem, row, verticalCenter } from '../CommonStyles';
import Row from './Row';
import TheFire from './TheFire';

export default class FireRow extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Row style={styles.row}>
        <TheFire disabled={this.props.fireDisabled} onPress={this.props.onPressFire}/>
          <View style={[styles.flexItem, styles.verticalCenter]}>
            <AnimatedBar duration={50} progress={this.props.fireProgress} />
          </View>
      </Row>
    )
  }
};

const styles = StyleSheet.create({
  flexItem,
  row,
  verticalCenter
});