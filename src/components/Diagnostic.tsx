import * as React from "react";
import {Text} from "react-native";

export class Diagnostic extends React.Component {

  static navigationOptions = ({navigation}) => ({
    title: "Диагностика приложения"
  })
  render() {
    return (
      <Text>"Hello World"</Text>
    );
  }
}