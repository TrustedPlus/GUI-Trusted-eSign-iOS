import * as React from "react";
import { Container, Header, Content, Left, Right, Button, Icon, Body, Title,
  List, ListItem, Thumbnail} from "native-base";
import {StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, Image} from "react-native";
import {Diagnostic} from "./Diagnostic";
import {Signature} from "./Signature";
import {Encryption} from "./Encryption";
import {Certificate} from "./Certificate";
import {Repository} from "./Repository";
import {Journal} from "./Journal";
import {styles} from "../styles";
import {StackNavigator} from "react-navigation";
import {ListMenu} from "./ListMenu";
import {License} from "./License";
import {Help} from "./Help";
import {DescriptionError} from "./DescriptionError";
import {Headers} from "./Headers";

interface MainProps {
  navigation: any;
}

class Main extends React.Component<MainProps> {
  static navigationOptions = {
    header: null
  };

  render() {
    const { navigate } = this.props.navigation;

    /*
      <Headers title="КриптоАрм ГОСТ" src={require("../../imgs/general/sidebar_icon.png")}
         goBack={() => this.props.navigation.navigate("DrawerOpen")}/>
    */
    return (
      <Container>
         <Header style={styles.header}>
          <Left style={styles.left}>
            <Button transparent onPress={() => this.props.navigation.navigate("DrawerOpen")}>
              <Image style={styles.headerImage} source={require("../../imgs/general/sidebar_icon.png")}/>
            </Button>
          </Left>
          <Body>
            <Title><Text style={{color: "white" }}>КриптоАрм ГОСТ</Text></Title>
          </Body>
          <Right style={styles.right}>
            <Button transparent>
              <Image style={styles.headerImage} source={require("../../imgs/general/setting_icon.png")}/>
            </Button>
          </Right>
        </Header>
        <Content>
          <List>
            <ListMenu title="Диагностика приложения"
            img={require("../../imgs/general/diagnostic_main_icon.png" )} note="ошибок: 1           замечаний: 1" nav={() => navigate("Diagnostic")}/>
            <ListMenu title="Подпись / проверка подписи"
            img={require("../../imgs/general/sign_main_icon.png")} note="выбрано файлов: 4" nav={() => navigate("Signature")}/>
            <ListMenu title="Шифрование / расшифрование"
            img={require("../../imgs/general/encode_main_icon.png")} note="выбрано файлов: 0" nav={() => navigate("Encryption")}/>
            <ListMenu title="Управление сертификатами"
            img={require("../../imgs/general/certificates_main_icon.png")} note="личных сертификатов: 6" nav={() => navigate("Certificate")}/>
            <ListMenu title="Управление хранилищами"
            img={require("../../imgs/general/stores_main_icon.png")} note="подключенных хранилищ: 2" nav={() => navigate("Repository")}/>
            <ListMenu title="Журнал операций"
            img={require("../../imgs/general/journal_main_icon.png")} note="выбрано файлов 4" nav={() => navigate("Journal")}/>
          </List>
        </Content>
      </Container>
    );
  }
}

export const menu = StackNavigator({
  Main: {screen: Main},
  Diagnostic: {screen: Diagnostic},
  Signature: {screen: Signature},
  Encryption: {screen: Encryption},
  Certificate: {screen: Certificate},
  Repository: {screen: Repository},
  Journal: {screen: Journal},
  License: { screen: License},
  Help: { screen: Help},
  DescriptionError: { screen: DescriptionError}
});