import * as React from "react";
import { Container, ListItem, View, Item, Input, List, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from "native-base";
import {Headers} from "./Headers";
import {ListMenu} from "./ListMenu";

interface PropertiesCertProps {
  navigation: any;
}

export class PropertiesCert extends React.Component<PropertiesCertProps> {

  static navigationOptions = {
    header: null
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <Headers title="Свойства сертфиката" src={require("../../imgs/general/back_icon.png")} goBack={() => this.props.navigation.goBack()}/>
        <List>
            <ListItem itemHeader first>
              <Text>Владелец</Text>
            </ListItem>
            <ListItem >
              <Text>Имя:</Text>
              <Text style={{position: "absolute", right: 5, color: "blue"}}>shesnokov</Text>
            </ListItem>
            <ListItem>
              <Text>Email:</Text>
              <Text style={{position: "absolute", right: 5, color: "blue"}}>shesnokov@gmail.com</Text>
            </ListItem>
            <ListItem>
              <Text>Огранизация:</Text>
              <Text style={{position: "absolute", right: 5, color: "blue"}}>ООО Цифровые технологии</Text>
            </ListItem>
            <ListItem last>
              <Text>Страна:</Text>
              <Text style={{position: "absolute", right: 5, color: "blue"}}>RU</Text>
            </ListItem>
            <ListItem itemHeader>
              <Text>Издатель</Text>
            </ListItem>
            <ListItem>
              <Text>Имя:</Text>
              <Text style={{position: "absolute", right: 5, color: "blue"}}>Тестовый УЦ ООО "Крипто Про</Text>
            </ListItem>
            <ListItem itemHeader first>
              <Text>Сертфикат</Text>
            </ListItem>
            <ListItem >
              <Text>Серийный номер:</Text>
              <Text style={{position: "absolute", right: 5, color: "blue"}}>A5 53 TE 3T 43 G4</Text>
            </ListItem>
            <ListItem>
              <Text>Годен до:</Text>
              <Text style={{position: "absolute", right: 5, color: "blue"}}>24.04.19</Text>
            </ListItem>
            <ListItem>
              <Text>Алгоритм подписи:</Text>
              <Text style={{position: "absolute", right: 5, color: "blue"}}>ГОСТ Р 34.11/34.10 - 2001</Text>
            </ListItem>
            <ListItem>
              <Text>Хэш-алгоритм:</Text>
              <Text style={{position: "absolute", right: 5, color: "blue"}}>ГОСТ Р 34.11 - 94</Text>
            </ListItem>
            <ListItem>
              <Text>Закрытый ключ:</Text>
              <Text style={{position: "absolute", right: 5, color: "blue"}}>присутствует</Text>
            </ListItem>
          </List>
      </Container>
    );
  }
}