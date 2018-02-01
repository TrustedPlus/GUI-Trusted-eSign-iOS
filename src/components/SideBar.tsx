import * as React from "react";
import { DrawerNavigator } from "react-navigation";
import { AppRegistry, Image, StatusBar, View, TouchableOpacity } from "react-native";
import { Container, Content, Text, List, ListItem, Thumbnail, Left } from "native-base";
import {SideListItem} from "./SideListItem";
import {styles} from "../styles";

interface SideBarProps {
  navigation?: any;
}

export class SideBar extends React.Component<SideBarProps> {
  render() {
    const { navigate } = this.props.navigation;
    const { goBack } = this.props.navigation;
    return (
      <Container>
        <Content>
        <View style={{height: 140}}>
          <TouchableOpacity onPress={() => {goBack(0); goBack(0); navigate("DrawerClose"); }}>
          <Image style={styles.splash_screen} source={require("../../imgs/general/splash_screen.png")} />
          <Image style={styles.splash_icon} source={require("../../imgs/general/splash_icon.png")}/>
          <Text style={styles.splash_text}>КриптоАРМ ГОСТ</Text>
          </TouchableOpacity>
        </View>
        <View>
        <List >
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
            <SideListItem title="Журнал операций"
          img={require("../../imgs/general/journal_menu_icon.png")} link={() => {
            goBack(0); navigate("Journal"); }} />
            <SideListItem title="Лицензия на приложение"
          img={require("../../imgs/general/license_menu_icon.png")} link={() => {
            goBack(0); navigate("License"); }} />
            <SideListItem title="Справочная помощь"
          img={require("../../imgs/general/help_menu_icon.png")} link={() => {
            goBack(0); navigate("Help"); }} />
            <SideListItem title="Выход"
          img={require("../../imgs/general/close_menu_icon.png")} link={() => navigate("DrawerClose")}/>
        </List>
        </View>
        </Content>
      </Container>
    );
  }
}