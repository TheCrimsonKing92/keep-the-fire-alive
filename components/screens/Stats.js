import React from 'react';
import { StyleSheet, View } from 'react-native';

import Banner from '../Banner';
import { container } from '../../CommonStyles';
import Footer from '../Footer';
import Title from '../Title';

export default class Stats extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Banner/>
        <Title text={'Stats'}/>
        <View style={{flex: 1}}></View>
        <Footer navigate={this.props.navigation.navigate} route={'Stats'} />
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container
});