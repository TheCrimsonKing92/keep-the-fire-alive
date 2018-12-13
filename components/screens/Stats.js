import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Banner from '../Banner';
import { container, title } from '../../CommonStyles';
import Footer from '../Footer';

export default class Stats extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Banner/>
        <Text style={styles.title}>Stats</Text>
        <View style={{flex: 1}}></View>
        <Footer navigate={this.props.navigation.navigate} route={'Stats'} />
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container,
  title
});