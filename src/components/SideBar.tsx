import * as React from "react";
import { DrawerNavigator } from "react-navigation";
import { AppRegistry, Image, StatusBar, View } from "react-native";
import { Container, Content, Text, List, ListItem, Thumbnail, Left } from "native-base";
import {SideListItem} from "./SideListItem";

interface SideBarProps {
  navigation?: any;
}

export class SideBar extends React.Component<SideBarProps> {
  render() {
    const { navigate } = this.props.navigation;
    const { goBack } = this.props.navigation;
    return (
      <Container>
        <Image style={{width: "100%", height: "20%"}} source={require("../../imgs/general/splash_screen.png")} />
        <Image style={{position: "absolute" , left: 100, top: 10,
          width: "24%", height: "10%"}} source={require("../../imgs/general/splash_icon.png")}/>
        <Text style={{position: "absolute" , left: 60, top: 90, fontSize: 20, color: "white"}}>КриптоАРМ ГОСТ</Text>
        <Content>
        <List>
          <SideListItem title="Диагностика приложения"
          img={require("../../imgs/general/diagnostic_menu_icon.png")} link={() => {
            goBack(0); navigate("Diagnostic"); }} />
            <SideListItem title="Подпись / проверка подписи"
          img={require("../../imgs/general/sign_menu_icon.png")} link={() => {
            goBack(0); navigate("Signature"); }} />
            <SideListItem title="Шифрование / расшифрование"
          img={require("../../imgs/general/encode_menu_icon.png")} link={() => {
            goBack(0); navigate("Encryption"); }} />
            <SideListItem title="Управление сертификатами"
          img={require("../../imgs/general/certificates_menu_icon.png")} link={() => {
            goBack(0); navigate("Certificate"); }} />
            <SideListItem title="Управление хранилищами"
          img={require("../../imgs/general/stores_menu_icon.png")} link={() => {
            goBack(0); navigate("Repository"); }} />
            <View>
            <SideListItem title="Журнал операций"
          img={require("../../imgs/general/journal_menu_icon.png")} link={() => {
            goBack(0); navigate("Journal"); }} />
            </View>
        </List>
        <View style={{height: "18%"}}/>
        <List>
            <SideListItem title="Лицензия на приложение"
          img={require("../../imgs/general/license_menu_icon.png")} link={() => {
            goBack(0); navigate("License"); }} />
            <SideListItem title="Справочная помощь"
          img={require("../../imgs/general/help_menu_icon.png")} link={() => {
            goBack(0); navigate("Help"); }} />
            <SideListItem title="Выход"
          img={require("../../imgs/general/close_menu_icon.png")} link={() => navigate("DrawerClose")}/>
        </List>
        </Content>
      </Container>
    );
  }
}