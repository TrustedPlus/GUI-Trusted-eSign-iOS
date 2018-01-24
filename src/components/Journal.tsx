import * as React from "react";
import {Text} from "react-native";

export class Journal extends React.Component {

  static navigationOptions = ({navigation}) => ({
    title: "Журнал операций"
  })
  render() {
    return (
      <Text>"Hello World"</Text>
    );
  }
}