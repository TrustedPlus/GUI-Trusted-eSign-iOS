import * as React from "react";
import {Container, Header, Item, Input, List, Content, Icon} from "native-base";
import {Headers} from "./Headers";
import ListMenu from "./ListMenu";
import {PropertiesCert} from "./PropertiesCert";
import {styles} from "../styles";
import * as RNFS from "react-native-fs";

interface PersonalСertProps {
  navigation: any;
}

export class PersonalСert extends React.Component<PersonalСertProps> {

  static navigationOptions = {
    header: null
  };

  render() {
    const { navigate, goBack } = this.props.navigation;
    return (
      <Container style={styles.container}>
        <Headers title="Личные сертификаты" src={require("../../imgs/general/back_icon.png")} goBack={() => goBack()}/>
        <Header searchBar>
          <Item>
            <Icon name="ios-search" />
            <Input placeholder="Поиск" />
          </Item>
        </Header>
        <Content>
          <List>
            <ListMenu title="GisJkh" img={require("../../imgs/general/cert2_ok_icon.png" )}
              rightimg={require("../../imgs/general/key_icon.png" )} note="CRYPTO-PRO Test Center 2" nav={() => null}/>
            <ListMenu title="shesnokov" img={require("../../imgs/general/cert2_ok_icon.png")}
              rightimg={require("../../imgs/general/key_icon.png" )} note='Тестовый УЦ ООО "Крипто Про"' nav={() => navigate("PropertiesCert")}/>
            <ListMenu title="serji" img={require("../../imgs/general/cert2_bad_icon.png")}
              note="serji" nav={() => null}/>
          </List>
        </Content>
      </Container>
    );
  }
}