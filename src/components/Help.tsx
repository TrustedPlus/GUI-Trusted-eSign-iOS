import * as React from "react";
import {Container} from "native-base";
import {Headers} from "./Headers";
import {styles} from "../styles";

interface HelpProps {
  navigation: any;
}

export class Help extends React.Component<HelpProps> {

  static navigationOptions = {
    header: null
  };

  render() {
    const { navigate, goBack } = this.props.navigation;
    return (
      <Container style={styles.container}>
        <Headers title="Справочная помощь" goBack={() => goBack()}/>
      </Container>
    );
  }
}