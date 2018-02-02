import * as React from "react";
import { Container, List, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from "native-base";
import {Headers} from "./Headers";
import {ListMenu} from "./ListMenu";

interface RepositoryProps {
  navigation: any;
}

export class Repository extends React.Component<RepositoryProps> {

  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <Container>
        <Headers title="Управление хранилищами" goBack={() => this.props.navigation.goBack()}/>
        <Content>
          <List>
            <ListMenu title="Личные сертификаты"
            img={require("../../imgs/general/certificates_menu_icon.png" )} nav={() => null}/>
            <ListMenu title="Сертификаты других пользователей"
            img={require("../../imgs/general/certificates_menu_icon.png")} nav={() => null}/>
            <ListMenu title="Промежуточные сертификаты"
            img={require("../../imgs/general/certificates_menu_icon.png")} nav={() => null}/>
            <ListMenu title="Доверенные корневые сертификаты"
            img={require("../../imgs/general/certificates_menu_icon.png")} nav={() => null}/>
          </List>
        </Content>
      </Container>
    );
  }
}