import * as React from "react";
import { Container, Header, View, Item, Input, List, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from "native-base";
import {Headers} from "./Headers";
import {ListMenu} from "./ListMenu";
import {PropertiesCert} from "./PropertiesCert";

interface PersonalСertProps {
  navigation: any;
}

export class PersonalСert extends React.Component<PersonalСertProps> {

  static navigationOptions = {
    header: null
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <Headers title="Личные сертификаты" src={require("../../imgs/general/back_icon.png")} goBack={() => this.props.navigation.goBack()}/>
        <Header searchBar>
          <Item>
            <Icon name="ios-search" />
            <Input placeholder="Поиск" />
          </Item>
        </Header>
        <Content>
          <List>
            <ListMenu title="GisJkh"
             img={require("../../imgs/general/cert2_ok_icon.png" )}
             rightimg={require("../../imgs/general/key_icon.png" )} note="CRYPTO-PRO Test Center 2" nav={() => null}/>
            <ListMenu title="shesnokov"
             img={require("../../imgs/general/cert2_ok_icon.png")}
             rightimg={require("../../imgs/general/key_icon.png" )} note='Тестовый УЦ ООО "Крипто Про"' nav={() => navigate("PropertiesCert")}/>
            <ListMenu title="serji"
             img={require("../../imgs/general/cert2_bad_icon.png")} note="serji" nav={() => null}/>
          </List>
        </Content>
      </Container>
    );
  }
}