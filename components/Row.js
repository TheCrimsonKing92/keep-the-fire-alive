import React from 'react';
import { StyleSheet, View } from 'react-native';

import { row } from '../CommonStyles';

export default Row = props => {
  return (
    <View style={styles.row}>{ props.children }</View>
  );
};

const styles = StyleSheet.create({
  row
});