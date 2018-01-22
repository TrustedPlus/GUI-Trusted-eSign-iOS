import React, { Component } from 'react';
import { Container, Header, Content, Left, Right, Button, Icon, Body, Title,
  List, ListItem, Thumbnail} from 'native-base';
import {StyleSheet, Text, TouchableHighlight, View, Image} from 'react-native';
import SignaturePage from '../pages/SignaturePage';
import EncryptionPage from '../pages/EncryptionPage';
import CertificatesPage from '../pages/CertificatesPage';
import styles from '../styles';
import {
  StackNavigator,
} from 'react-navigation';

class Main extends Component {
  static navigationOptions = {
    title: 'Главная страница',
    drawerLabel: () => (
      <Text style={styles.text}>КриптоАРМ ГОСТ</Text>
    ),
    drawerIcon: () => (
      <Image
        source={require('../imgs/home.png')}
        style={[styles.tabIcon, {tintColor: 'black'}]}
      />
    ),
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <Content>
          <List>
            <ListItem style={{marginLeft:0}} avatar onPress={() =>
          navigate('CertificatesPage')}>
              <Left>
                <Icon name='settings' style={{fontSize:30, width: 35, padding: 5}}/>  
              </Left>
              <Body>
                <Text style={{fontSize:20}}>Диагностика приложения</Text>
                <Text note>выбрано файлов: 4</Text>
              </Body>
              <Right>
              </Right>
            </ListItem>
            <ListItem style={{marginLeft:0}} avatar onPress={() =>
                navigate('Encryption')}>
              <Left>
                <Icon name='settings' style={{fontSize:30, width: 35, padding: 5}}/>  
              </Left>
              <Body>
                <Text style={{fontSize:20}}>Подпись / проверка подписи</Text>
                <Text note>выбрано файлов: 4</Text>
              </Body>
            </ListItem>
            <ListItem style={{marginLeft:0}} avatar onPress={() =>
              navigate('SignaturePage')}>
              <Left>
                <Icon name='settings' style={{fontSize:30, width: 35, padding: 5}}/>  
              </Left>
              <Body>
                <Text style={{fontSize:20}}>Шифрование / расшифрование</Text>
                <Text note>выбрано файлов: 0</Text>
              </Body>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}

export const App = StackNavigator({
  Main: {screen: Main},
  Encryption: {screen: EncryptionPage},
  CertificatesPage: {screen: CertificatesPage},
  SignaturePage: {screen: SignaturePage}
});