import React, { Component } from 'react';
import { StyleSheet, Text, Image, View} from 'react-native';
import { Container, Header, Content, Left, Right, Button, Icon, Body, Title } from 'native-base';
import styles from '../styles'; 

export default class SecondScreen extends Component {
  
  static navigationOptions = {
    drawerLabel: () => (
      <Text style={styles.text}>Второй экран</Text>
    ),
    drawerIcon: () => (
      <Image
        source={require('../imgs/tablet.png')}
        style={[styles.tabIcon, {tintColor: 'black'}]}
      />
    ),
  }
  
  render() {
    return (
      <Container>
        <Header style={{backgroundColor: 'red'}}>
          <Body >
            <Title>Header</Title>
          </Body>
        </Header>
        <Text>
          THIS IS THE SECOND SCREEN!
        </Text>
      </Container>
    );
  }
};