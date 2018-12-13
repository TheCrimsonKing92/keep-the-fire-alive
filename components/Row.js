import React from 'react';
import { StyleSheet, View } from 'react-native';

import { row } from '../CommonStyles';

export default Row = props => {
  console.log('Children length?', props.children.length);
  return (
    <View style={styles.row}>{ props.children }</View>
  );
};

const styles = StyleSheet.create({
  row
});