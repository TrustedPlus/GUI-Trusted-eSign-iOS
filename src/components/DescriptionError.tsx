import * as React from "react";
import { Container, List, Title, Content, Footer, FooterTab, View, Button, Left, Right, Body, Icon, Text } from "native-base";
import {Headers} from "./Headers";

interface DescriptionErrorProps {
  navigation: any;
}

export class DescriptionError extends React.Component<DescriptionErrorProps> {

  static navigationOptions = {
    header: null
  };
  render() {
    return (
      <Container>
        <Headers title="Диагностика" src={require("../../imgs/general/back_icon.png")} goBack={() => this.props.navigation.goBack()}/>
        <Content style={{backgroundColor: "white"}}>
          <View style={{padding: 15}}>
            <Text style={{fontSize: 23, color: "grey"}}>Проблема</Text>
          </View>
          <View style={{padding: 15, paddingBottom: 40}}>
            <Text style={{fontSize: 17}}>Отсутствует лицензия на приложение</Text>
          </View>
          <View style={{padding: 15}}>
            <Text style={{fontSize: 23, color: "grey"}}>Решение</Text>
          </View>
          <View style={{padding: 15}}>
            <Text style={{fontSize: 17}}>Решение проблемы (текстовое описание с гиперссылками и возможными вставками рисунков).</Text>
          </View>
        </Content>
      </Container>
    );
  }
}