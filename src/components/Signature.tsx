import * as React from "react";
import {Text} from "react-native";

export class Signature extends React.Component {

  static navigationOptions = ({navigation}) => ({
    title: "Подпись / проверка подписи"
  })
  render() {
    return (
      <Text>"Hello World"</Text>
    );
  }
}