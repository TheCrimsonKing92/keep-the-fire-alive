import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { title } from '../CommonStyles';

export default Title = ({text}) => <Text style={styles.title}>{ text }</Text>;

const styles = StyleSheet.create({
  title
});