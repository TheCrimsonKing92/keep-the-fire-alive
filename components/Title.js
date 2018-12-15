import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { title } from '../CommonStyles';

export default Title = ({style, text}) => <Text style={[styles.title, style]}>{ text }</Text>;

const styles = StyleSheet.create({
  title
});