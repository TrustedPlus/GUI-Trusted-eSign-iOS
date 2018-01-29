import * as React from "react";
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from "native-base";
import {Headers} from "./Headers";

interface RepositoryProps {
  navigation: any;
}

export class Repository extends React.Component<RepositoryProps> {

  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <Container>
        <Headers title="Управление хранилищами" goBack={() => this.props.navigation.goBack()}/>
      </Container>
    );
  }
}