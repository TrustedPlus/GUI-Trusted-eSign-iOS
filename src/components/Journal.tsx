import * as React from "react";
import {Text} from "react-native";
import {Icon} from "native-base";

export class Journal extends React.Component {

  static navigationOptions = ({navigation}) => ({
    title: "Журнал операций",
    headerTintColor: "white",
    headerStyle:
      { backgroundColor: "#be3817", borderWidth: 1, borderBottomColor: "white" }
    ,
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