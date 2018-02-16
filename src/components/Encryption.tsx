import * as React from "react";
import {Container, View, Content, Button, Body, Text } from "native-base";
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
    const { navigate, goBack } = this.props.navigation;
    return (
      <Container style={styles.container}>
        <Headers title="Шифрование/расшифрование" goBack={() => goBack()}/>
        <Content>
          <View style={styles.sign_enc_view}>
            <Text style={styles.sign_enc_title}>Сертификаты получателей</Text>
            <Button transparent style={styles.sign_enc_button}>
              <Image style={styles.headerImage} source={require("../../imgs/general/add_icon.png")}/>
            </Button>
          </View>
          <Body>
          <View style={styles.sign_enc_view}>
            <Text style={styles.sign_enc_prompt}>[Добавьте сертификаты получателей]</Text>
          </View>
          </Body>
          <View style={styles.sign_enc_view}>
            <Text style={styles.sign_enc_title}>Файлы</Text>
            <Button transparent style={styles.sign_enc_button}>
              <Image style={styles.headerImage} source={require("../../imgs/general/add_icon.png")}/>
            </Button>
          </View>
          <Body>
          <View style={styles.sign_enc_view}>
            <Text style={styles.sign_enc_prompt}>[Добавьте файлы]</Text>
          </View>
          </Body>
        </Content>
      </Container>
    );
  }
}