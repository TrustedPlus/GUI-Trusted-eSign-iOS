import * as React from "react";
import {Container} from "native-base";
import {Headers} from "./Headers";
import {styles} from "../styles";

interface LicenseProps {
  navigation: any;
}

export class License extends React.Component<LicenseProps> {

  static navigationOptions = {
    header: null
  };

  render() {
    const { navigate, goBack } = this.props.navigation;
    return (
      <Container style={styles.container}>
        <Headers title="Лицензия" goBack={() => goBack()}/>
      </Container>
    );
  }
}