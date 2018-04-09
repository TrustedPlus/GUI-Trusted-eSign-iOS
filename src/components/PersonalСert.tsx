import * as React from "react";
import {Container, Header, Item, Input, List, Content, Icon, Text } from "native-base";
import {Headers} from "./Headers";
import ListMenu from "./ListMenu";
import {styles} from "../styles";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { readCertKeys} from "../actions/CertKeysAction";
import { PropertiesCert} from "./PropertiesCert";

interface PersonalСertProps {
  navigation: any;
  pesronalCertKeys: any;
  readCertKeys(): any;
}

class PersonalСert extends React.Component<PersonalСertProps> {

  static navigationOptions = {
    header: null
  };

  ShowList(img) {
    return (
      this.props.pesronalCertKeys.map((cert, key) => <ListMenu
        key = {key}
        title = {cert.issuerFriendlyName}
        note = {cert.organizationName}
        img = {img[key]}
        personal
        issuerName = {cert.issuerName}
        serialNumber = {cert.serialNumber}
        rightimg = {cert.hasPrivateKey ? require("../../imgs/general/key_icon.png") : null}
        nav={() => this.props.navigation.navigate("PropertiesCert", { cert: cert})} />));
  }

  render() {
    const { pesronalCertKeys} = this.props;
    const { goBack } = this.props.navigation;

    let img = [];
    for (let i = 0; i < pesronalCertKeys.length; i++) { // какое расширение у файлов
      switch (pesronalCertKeys[i].extension) {
        default:
          img[i] = require("../../imgs/general/cert2_ok_icon.png"); break;
      }
    }

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
          {this.ShowList(img)}
        </List>
        </Content>
      </Container>
    );
  }

  componentDidMount() {
    this.props.readCertKeys();
  }
}

function mapStateToProps(state) {
  return {
    pesronalCertKeys: state.certKeys.pesronalCertKeys
  };
}

function mapDispatchToProps(dispatch) {
  return {
    readCertKeys: bindActionCreators(readCertKeys, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonalСert);