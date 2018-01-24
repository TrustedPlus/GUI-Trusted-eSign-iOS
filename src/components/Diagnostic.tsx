import * as React from "react";
import {Text} from "react-native";
import {Icon} from "native-base";

export class Diagnostic extends React.Component {

  static navigationOptions = ({navigation}) => ({
    title: "Диагностика приложения",
    headerTintColor: "white",
    headerStyle: {
      backgroundColor: "#be3817"
    },
    headerLeft: (
      <Icon name="home" style={{color: "white", padding: 10}} onPress={() => navigation.goBack()} />
    )
  })
  render() {
    return (
      <Text></Text>
    );
  }
}