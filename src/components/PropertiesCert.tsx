import * as React from "react";
import { Container, Header, View, Item, Input, List, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from "native-base";
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
      </Container>
    );
  }
}