import * as React from "react";
import {Text} from "react-native";

export class Certificate extends React.Component {

  static navigationOptions = ({navigation}) => ({
    title: "Управление сертификатами"
  })
  render() {
    return (
      <Text>"Hello World"</Text>
    );
  }
}