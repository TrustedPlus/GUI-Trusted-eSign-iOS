import * as React from "react";
import { Container, Header, List, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from "native-base";
import {Headers} from "./Headers";
import ListMenu from "./ListMenu";

interface CertificateProps {
  navigation: any;
}

export class Certificate extends React.Component<CertificateProps> {

  static navigationOptions = {
    header: null
  };
  render() {
    const { navigate, goBack } = this.props.navigation;
    return (
      <Container style={{backgroundColor: "white"}}>
        <Headers title="Сертификаты" goBack={() => goBack()}/>
        <Content>
          <List>
            <ListMenu title="КриптоПро Cloud ООО ТЕНЗОР"
            img={require("../../imgs/general/certificates_menu_icon.png" )} arrow nav={() => null}/>
            <ListMenu title="КриптоПро Cloud TEST"
            img={require("../../imgs/general/certificates_menu_icon.png")} arrow nav={() => null}/>
            <ListMenu title="Локальное хранилище"
            img={require("../../imgs/general/certificates_menu_icon.png")} arrow nav={() => null}/>
            <ListMenu title="SD Card Alladin"
            img={require("../../imgs/general/certificates_menu_icon.png")} arrow nav={() => null}/>
          </List>
        </Content>
      </Container>
    );
  }
}