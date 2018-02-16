import * as React from "react";
import {Container, Header, Item, Input, List, Content, Icon, Text } from "native-base";
import {Headers} from "./Headers";
import ListMenu from "./ListMenu";
import {styles} from "../styles";

interface SelectСertProps {
  navigation: any;
}

export class SelectСert extends React.Component<SelectСertProps> {

  static navigationOptions = {
    header: null
  };

  render() {
    const { navigate, goBack } = this.props.navigation;
    return (
      <Container style={styles.container}>
        <Headers title="Выберите сертификат" src={require("../../imgs/general/back_icon.png")} goBack={() => goBack()}/>
        <Header searchBar>
          <Item>
            <Icon name="ios-search" />
            <Input placeholder="Поиск" />
          </Item>
        </Header>
        <Content>
          <List>
            <ListMenu title="GisJkh" img={require("../../imgs/general/cert2_ok_icon.png" )}
              check note="CRYPTO-PRO Test Center 2" rightimg={require("../../imgs/general/key_icon.png" )} nav={() => goBack()}/>
            <ListMenu title="shesnokov" img={require("../../imgs/general/cert2_ok_icon.png")}
              check note='Тестовый УЦ ООО "Крипто Про"' rightimg={require("../../imgs/general/key_icon.png" )} nav={() => goBack()}/>
            <ListMenu title="serji" img={require("../../imgs/general/cert2_bad_icon.png")}
              check note="serji" nav={() => goBack()}/>
          </List>
        </Content>
      </Container>
    );
  }
}