import * as React from "react";
import { Container, View, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from "native-base";
import {Image} from "react-native";
import {Headers} from "./Headers";
import {styles} from "../styles";

interface EncryptionProps {
  navigation: any;
}

export class Encryption extends React.Component<EncryptionProps> {

  static navigationOptions = {
    header: null
  };
  render() {
    return (
      <Container>
        <Headers title="Шифрование/расшифрование" goBack={() => this.props.navigation.goBack()}/>
        <Content style={{backgroundColor: "white"}}>
          <View style={{padding: 15}}>
            <Text style={{fontSize: 23, color: "grey", width: "80%"}}>Сертификаты получателей</Text>
            <Button transparent style={{position: "absolute", marginTop: 6, right: 10}}>
              <Image style={styles.headerImage} source={require("../../imgs/general/add_icon.png")}/>
            </Button>
          </View>
          <Body>
          <View style={{padding: 15, paddingBottom: 40}}>
            <Text style={{fontSize: 17, color: "lightgrey"}}>[Добавьте сертификаты получателей]</Text>
          </View>
          </Body>
          <View style={{padding: 15}}>
            <Text style={{fontSize: 23, color: "grey"}}>Файлы</Text>
            <Button transparent style={{position: "absolute", marginTop: 6, right: 10}}>
              <Image style={styles.headerImage} source={require("../../imgs/general/add_icon.png")}/>
            </Button>
          </View>
          <Body>
          <View style={{padding: 15}}>
            <Text style={{fontSize: 17, color: "lightgrey"}}>[Добавьте файлы]</Text>
          </View>
          </Body>
        </Content>
      </Container>
    );
  }
}