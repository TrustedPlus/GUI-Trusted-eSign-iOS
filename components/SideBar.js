import React, { Component } from 'react';
import { AppRegistry, Image, StatusBar, View } from "react-native";
import { Container, Content, Text, List, ListItem } from "native-base";

const SideTitle = ['КриптоАРМ ГОСТ',
  'Диагностика приложения',
  'Подпись / проверка подписи',
  'Шифрование / расшифрование',
  'Управление сертификатами',
  'Управление хранилищами',
  'Журнал операций'];

const SideLinks = ['App',
  'Diagnostic',
  'Signature',
  'Encryption',
  'Сertificate',
  'Repository',
  'Journal'];

export default class SideBar extends Component {
  render() {
    var SideData = []; 
    for (var i = 0; i < SideTitle.length; i ++) { 
      SideData.push ({'title': SideTitle[i], 'link': SideLinks[i]}); 
    }
    return (
      <Container>
        <Content>
          <List
            dataArray={SideData}
            renderRow={SideData => {
              return (
                <ListItem
                  button
                  onPress={() => this.props.navigation.navigate(SideData.link)}>
                  <Text>{SideData.title}</Text>
                </ListItem>
              );
            }}
          />
          <View style={{paddingBottom: "100%", backgroundColor: "#ffffcc"}}/>
          <List>
            <ListItem>
              <Text>Справка</Text>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}