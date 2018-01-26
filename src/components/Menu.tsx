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

interface MainProps {
  navigation: any;
}

class Main extends React.Component<MainProps> {
  static navigationOptions = {
    title: "КриптоАРМ ГОСТ",
    headerTintColor: "white",
    headerStyle: {
      backgroundColor: "#be3817"
    }
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <Content>
          <List>
            <ListMenu title="Диагностика приложения"
            img={require("../../imgs/general/diagnostic_main_icon.png" )} nav={() => navigate("Diagnostic")}/>
            <ListMenu title="Подпись / проверка подписи"
            img={require("../../imgs/general/sign_main_icon.png")} nav={() => navigate("Signature")}/>
            <ListMenu title="Шифрование / расшифрование"
            img={require("../../imgs/general/encode_main_icon.png")} nav={() => navigate("Encryption")}/>
            <ListMenu title="Управление сертификатами"
            img={require("../../imgs/general/certificates_main_icon.png")} nav={() => navigate("Certificate")}/>
            <ListMenu title="Управление хранилищами"
            img={require("../../imgs/general/stores_main_icon.png")} nav={() => navigate("Repository")}/>
            <ListMenu title="Журнал операций"
            img={require("../../imgs/general/journal_main_icon.png")} nav={() => navigate("Journal")}/>
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
  Journal: {screen: Journal}
});