import * as React from "react";
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from "native-base";
import {Headers} from "./Headers";

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
      </Container>
    );
  }
}