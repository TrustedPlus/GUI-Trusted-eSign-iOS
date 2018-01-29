import * as React from "react";
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from "native-base";
import {Headers} from "./Headers";

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
      </Container>
    );
  }
}