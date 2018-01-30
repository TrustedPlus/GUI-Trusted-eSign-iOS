import * as React from "react";
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from "native-base";
import {Headers} from "./Headers";

interface HelpProps {
  navigation: any;
}

export class Help extends React.Component<HelpProps> {

  static navigationOptions = {
    header: null
  };
  render() {
    return (
      <Container>
        <Headers title="Справочная помощь" goBack={() => this.props.navigation.goBack()}/>
      </Container>
    );
  }
}