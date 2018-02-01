import * as React from "react";
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from "native-base";
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
      </Container>
    );
  }
}