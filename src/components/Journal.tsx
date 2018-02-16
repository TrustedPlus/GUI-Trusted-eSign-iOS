import * as React from "react";
import {Container} from "native-base";
import {Headers} from "./Headers";
import {styles} from "../styles";

interface JournalProps {
  navigation: any;
  goBack: void;
}

export class Journal extends React.Component<JournalProps> {

  static navigationOptions = {
    header: null
  };

  render() {
    const { navigate, goBack } = this.props.navigation;
    return (
      <Container style={styles.container}>
        <Headers title="Журнал операций" goBack={() => goBack()}/>
      </Container>
    );
  }
}