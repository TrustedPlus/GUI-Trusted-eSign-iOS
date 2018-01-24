import * as React from "react";
import {Text} from "react-native";

export class Encryption extends React.Component {

  static navigationOptions = ({navigation}) => ({
    title: "Шифрование / расшифрование"
  })
  render() {
    return (
      <Text>"Hello World"</Text>
    );
  }
}