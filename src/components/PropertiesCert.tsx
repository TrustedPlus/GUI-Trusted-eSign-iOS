import * as React from "react";
import {Container, ListItem, View, List, Content, Text } from "native-base";
import {Image} from "react-native";
import {Headers} from "./Headers";
import {styles} from "../styles";

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
      <Container style={styles.container}>
        <Headers title="Свойства сертфиката" src={require("../../imgs/general/back_icon.png")} goBack={() => goBack()}/>
        <Content style={{backgroundColor: "white"}}>
        <View>
          <Image style={styles.prop_cert_img} source={require("../../imgs/general/cert_ok_icon.png")}/>
          <Text style={styles.prop_cert_title}>shesnokov</Text>
          <Text style={styles.prop_cert_status}>Cтатус сертификата:
            <Text style={{color: "green"}}> действителен</Text>
          </Text>
        </View>
        <List>
            <ListItem itemHeader first>
              <Text>Владелец</Text>
            </ListItem>
            <ListItem >
              <Text>Имя:</Text>
              <Text style={styles.prop_cert_righttext}>shesnokov</Text>
            </ListItem>
            <ListItem>
              <Text>Email:</Text>
              <Text style={styles.prop_cert_righttext}>shesnokov@gmail.com</Text>
            </ListItem>
            <ListItem>
              <Text>Огранизация:</Text>
              <Text style={styles.prop_cert_righttext}>ООО Цифровые технологии</Text>
            </ListItem>
            <ListItem last>
              <Text>Страна:</Text>
              <Text style={styles.prop_cert_righttext}>RU</Text>
            </ListItem>
            <ListItem itemHeader>
              <Text>Издатель</Text>
            </ListItem>
            <ListItem last>
              <Text>Имя:</Text>
              <Text style={styles.prop_cert_righttext}>Тестовый УЦ ООО "Крипто Про"</Text>
            </ListItem>
            <ListItem itemHeader>
              <Text>Сертфикат</Text>
            </ListItem>
            <ListItem >
              <Text>Серийный номер:</Text>
              <Text style={styles.prop_cert_righttext}>A5 53 TE 3T 43 G4</Text>
            </ListItem>
            <ListItem>
              <Text>Годен до:</Text>
              <Text style={styles.prop_cert_righttext}>24.04.19</Text>
            </ListItem>
            <ListItem>
              <Text style={{width: "50%"}}>Алгоритм подписи:</Text>
              <Text style={styles.prop_cert_righttext}>ГОСТ Р 34.11/34.10 - 2001</Text>
            </ListItem>
            <ListItem>
              <Text>Хэш-алгоритм:</Text>
              <Text style={styles.prop_cert_righttext}>ГОСТ Р 34.11 - 94</Text>
            </ListItem>
            <ListItem last>
              <Text>Закрытый ключ:</Text>
              <Text style={styles.prop_cert_righttext}>присутствует</Text>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}