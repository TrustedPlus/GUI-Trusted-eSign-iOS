import * as React from "react";
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from "native-base";
import {Headers} from "./Headers";

interface LicenseProps {
  navigation: any;
}

export class License extends React.Component<LicenseProps> {

  static navigationOptions = {
    header: null
  };
  render() {
    return (
      <Container>
        <Headers title="Лицензия" goBack={() => this.props.navigation.goBack()}/>
      </Container>
    );
  }
}