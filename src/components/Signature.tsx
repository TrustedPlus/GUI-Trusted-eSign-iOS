import * as React from "react";
import {Text} from "react-native";
import {Icon} from "native-base";
export class Signature extends React.Component {

  static navigationOptions = ({navigation}) => ({
    title: "Подпись / проверка подписи",
    headerTintColor: "white",
    headerStyle: {
      backgroundColor: "#be3817"
    },
    headerLeft: (
      <Icon name="home" style={{color: "white", padding: 10}} onPress={() => navigation.goBack(0)} />
    )
  })
  render() {
    return (
      <Text></Text>
    );
  }
}