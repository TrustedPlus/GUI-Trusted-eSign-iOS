import * as React from "react";
import {Text} from "react-native";

export class Repository extends React.Component {

  static navigationOptions = ({navigation}) => ({
    title: "Управление хранилищами"
  })
  render() {
    return (
      <Text>"Hello World"</Text>
    );
  }
}