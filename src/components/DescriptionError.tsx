import * as React from "react";
import {Container, Content, View, Text } from "native-base";
import {Headers} from "./Headers";
import {styles} from "../styles";

interface DescriptionErrorProps {
  navigation: any;
}

export class DescriptionError extends React.Component<DescriptionErrorProps> {

  static navigationOptions = {
    header: null
  };

  render() {
    const { goBack } = this.props.navigation;
    return (
      <Container style={styles.container}>
        <Headers title="Диагностика" src={require("../../imgs/general/back_icon.png")} goBack={() => goBack()}/>
        <Content>
          <View style={styles.sign_enc_view}>
            <Text style={styles.sign_enc_title}>Проблема</Text>
          </View>
          <View style={styles.sign_enc_view}>
            <Text style={{fontSize: 17}}>Отсутствует лицензия на приложение</Text>
          </View>
          <View style={styles.sign_enc_view}>
            <Text style={styles.sign_enc_title}>Решение</Text>
          </View>
          <View style={styles.sign_enc_view}>
            <Text style={{fontSize: 17}}>Решение проблемы (текстовое описание с гиперссылками и возможными вставками рисунков).</Text>
          </View>
        </Content>
      </Container>
    );
  }
}