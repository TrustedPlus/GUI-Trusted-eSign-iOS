import * as React from "react";
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from "native-base";
import {Headers} from "./Headers";

interface DiagnosticProps {
  navigation: any;
}

export class Diagnostic extends React.Component<DiagnosticProps> {

  static navigationOptions = {
    header: null
  };
  render() {
    return (
      <Container>
        <Headers title="Диагностика" goBack={() => this.props.navigation.goBack()}/>
      </Container>
    );
  }
}