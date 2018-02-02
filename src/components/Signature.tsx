import * as React from "react";
import { Container, View, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from "native-base";
import {StyleSheet, TouchableOpacity, TouchableHighlight, Image} from "react-native";
import {Headers} from "./Headers";
import {styles} from "../styles";

interface SignatureProps {
  navigation: any;
}

export class Signature extends React.Component<SignatureProps> {

  static navigationOptions = {
    header: null
  };
  render() {
    return (
      <Container>
        <Headers title="Подпись/проверка" goBack={() => this.props.navigation.goBack()}/>
        <Content style={{backgroundColor: "white"}}>
          <View style={{padding: 15}}>
            <Text style={{fontSize: 23, color: "grey", width: "80%"}}>Сертификат подписи</Text>
            <Button transparent style={{position: "absolute", marginTop: 6, marginLeft: "95%"}}>
              <Image style={styles.headerImage} source={require("../../imgs/general/add_icon.png")}/>
            </Button>
          </View>
          <Body>
          <View style={{padding: 15, paddingBottom: 40}}>
            <Text style={{fontSize: 17, color: "lightgrey"}}>[Добавьте сертификат подписчика]</Text>
          </View>
          </Body>
          <View style={{padding: 15}}>
            <Text style={{fontSize: 23, color: "grey", width: "70%"}}>Файлы</Text>
            <Button transparent style={{position: "absolute", marginTop: 6, marginLeft: "95%"}}>
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