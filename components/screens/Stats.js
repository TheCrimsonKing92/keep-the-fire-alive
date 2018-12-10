import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Footer from '../Footer';

export default class Stats extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Stats</Text>
        <Footer navigate={this.props.navigation.navigate} route={'Stats'} />
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start'
  }
});