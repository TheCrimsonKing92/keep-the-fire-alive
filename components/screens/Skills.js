import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Banner from '../Banner';
import Footer from '../Footer';
import { container, title } from '../../CommonStyles';

export default class Skills extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Banner/>
        <Text style={styles.title}>Skills</Text>
        <View style={{flex: 1}}></View>
        <Footer navigate={this.props.navigation.navigate} route={'Skills'} />
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container,
  title
});