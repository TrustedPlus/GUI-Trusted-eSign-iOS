import * as React from "react";
import { Container, ListItem, View, Item, Input, List,
   Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from "native-base";
import {Image} from "react-native";
import {Headers} from "./Headers";

interface PropertiesCertProps {
  navigation: any;
}

export class PropertiesCert extends React.Component<PropertiesCertProps> {

  static navigationOptions = {
    header: null
  };

  render() {
    const { navigate, goBack } = this.props.navigation;
    return (
      <Container>
        <Headers title="Свойства сертфиката" src={require("../../imgs/general/back_icon.png")} goBack={() => goBack()}/>
        <Content style={{backgroundColor: "white"}}>
        <View>
        <Image style={{height: 70, width: 70, margin: 20}} source={require("../../imgs/general/cert_ok_icon.png")}/>
        <Text style={{fontSize: 20, position: "absolute", left: 110, top: 20}}>shesnokov</Text>
        <Text style={{fontSize: 17, color: "grey", position: "absolute", left: 110, top: 50, right: 5}}>Cтатус сертификата:
          <Text style={{color: "green"}}> действителен</Text>
        </Text>
        </View>
        <List>
            <ListItem itemHeader first>
              <Text>Владелец</Text>
            </ListItem>
            <ListItem >
              <Text>Имя:</Text>
              <Text style={{position: "absolute", width: "60%", right: 5, textAlign: "right", color: "blue"}}>shesnokov</Text>
            </ListItem>
            <ListItem>
              <Text>Email:</Text>
              <Text style={{position: "absolute", width: "60%", right: 5, textAlign: "right", color: "blue"}}>shesnokov@gmail.com</Text>
            </ListItem>
            <ListItem>
              <Text>Огранизация:</Text>
              <Text style={{position: "absolute", width: "60%", right: 5, textAlign: "right", color: "blue"}}>ООО Цифровые технологии</Text>
            </ListItem>
            <ListItem last>
              <Text>Страна:</Text>
              <Text style={{position: "absolute", width: "60%", right: 5, textAlign: "right", color: "blue"}}>RU</Text>
            </ListItem>
            <ListItem itemHeader>
              <Text>Издатель</Text>
            </ListItem>
            <ListItem last>
              <Text>Имя:</Text>
              <Text style={{position: "absolute", width: "60%", right: 5, textAlign: "right", color: "blue"}}>Тестовый УЦ ООО "Крипто Про"</Text>
            </ListItem>
            <ListItem itemHeader>
              <Text>Сертфикат</Text>
            </ListItem>
            <ListItem >
              <Text>Серийный номер:</Text>
              <Text style={{position: "absolute", width: "60%", right: 5, textAlign: "right", color: "blue"}}>A5 53 TE 3T 43 G4</Text>
            </ListItem>
            <ListItem>
              <Text>Годен до:</Text>
              <Text style={{position: "absolute", width: "60%", right: 5, textAlign: "right", color: "blue"}}>24.04.19</Text>
            </ListItem>
            <ListItem>
              <Text style={{width: "50%"}}>Алгоритм подписи:</Text>
              <Text style={{position: "absolute", width: "60%", right: 5, textAlign: "right", color: "blue"}}>ГОСТ Р 34.11/34.10 - 2001</Text>
            </ListItem>
            <ListItem>
              <Text>Хэш-алгоритм:</Text>
              <Text style={{position: "absolute", width: "60%", right: 5, textAlign: "right", color: "blue"}}>ГОСТ Р 34.11 - 94</Text>
            </ListItem>
            <ListItem last>
              <Text>Закрытый ключ:</Text>
              <Text style={{position: "absolute", width: "60%", right: 5, textAlign: "right", color: "blue"}}>присутствует</Text>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}