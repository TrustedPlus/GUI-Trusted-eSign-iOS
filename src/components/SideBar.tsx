import * as React from "react";
import { DrawerNavigator } from "react-navigation";
import { AppRegistry, Image, StatusBar, View } from "react-native";
import { Container, Content, Text, List, ListItem } from "native-base";

const sideTitle = ["КриптоАРМ ГОСТ",
  "Диагностика приложения",
  "Подпись / проверка подписи",
  "Шифрование / расшифрование",
  "Управление сертификатами",
  "Управление хранилищами",
  "Журнал операций"];

const sideLinks = ["Menu",
  "Diagnostic",
  "Signature",
  "Encryption",
  "Certificate",
  "Repository",
  "Journal"];

  interface SideBarProps {
    navigation?: any;
  }

export class SideBar extends React.Component<SideBarProps> {
  render() {
    let sideData = [];
    for (let i = 0; i < sideTitle.length; i ++) {
      sideData.push ({"title": sideTitle[i], "link": sideLinks[i]});
    }
    return (
      <Container>
        <Content>
          <List
            dataArray={sideData}
            renderRow={(item) => {
              return (
                <ListItem
                  button
                  onPress={() => {
                    this.props.navigation.goBack(0);
                    this.props.navigation.navigate(item.link);
                    }}>
                  <Text>{item.title}</Text>
                </ListItem>
              );
            }}
          />
          <View style={{paddingBottom: "100%", backgroundColor: "#ffffcc"}}/>
          <List>
            <ListItem>
              <Text>Справка</Text>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}