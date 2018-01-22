import React, { Component } from 'react';
import { Container, Header, Content, Left, Right, Button, Icon, Body, Title,
  List, ListItem, Thumbnail} from 'native-base';
import {StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, Image} from 'react-native';
import Diagnostic from './Diagnostic';
import Signature from './Signature';
import Encryption from './Encryption';
import Сertificate from './Сertificate';
import Repository from './Repository';
import Journal from './Journal';
import styles from '../styles';
import {
  StackNavigator,
} from 'react-navigation';
import ListMenu from '../components/ListMenu';

class Main extends Component {
  static navigationOptions = {
    title: 'КриптоАРМ ГОСТ',
    /*headerTintColor: "blue",
    headerStyle: {
      backgroundColor:"red"
    },*/
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <Content>
          <List>
            <ListMenu title="Диагностика приложения" nav={() => navigate('Diagnostic')}/>
            <ListMenu title="Подпись / проверка подписи" nav={() => navigate('Signature')}/>
            <ListMenu title="Шифрование / расшифрование" nav={() => navigate('Encryption')}/>
            <ListMenu title="Управление сертификатами" nav={() => navigate('Сertificate')}/>
            <ListMenu title="Управление хранилищами" nav={() => navigate('Repository')}/>
            <ListMenu title="Журнал операций" nav={() => navigate('Journal')}/>
          </List>
        </Content>
      </Container>
    );
  }
}

export const App = StackNavigator({
  Main: {screen: Main},
  Diagnostic: {screen: Diagnostic},
  Signature: {screen: Signature},
  Encryption: {screen: Encryption},
  Сertificate: {screen: Сertificate},
  Repository: {screen: Repository},
  Journal: {screen: Journal}
});