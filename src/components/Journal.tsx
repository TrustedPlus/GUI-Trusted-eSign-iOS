import * as React from "react";
import { Container, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from "native-base";
import {Headers} from "./Headers";

interface JournalProps {
  navigation: any;
  goBack: void;
}

export class Journal extends React.Component<JournalProps> {
  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <Container>
        <Headers title="Журнал операций" goBack={() => this.props.navigation.goBack()}/>
      </Container>
    );
  }
}