import * as React from "react";
import {Container, Header, Item, Input, List, Content, Icon, Text } from "native-base";
import {Headers} from "./Headers";
import ListMenu from "./ListMenu";
import {styles} from "../styles";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { readCertKeys} from "../actions/CertKeysAction";
import { PropertiesCert} from "./PropertiesCert";

interface OtherСertProps {
  navigation: any;
  otherCertKeys: any;
  readCertKeys(): any;
}

class OtherСert extends React.Component<OtherСertProps> {

  static navigationOptions = {
    header: null
  };

  ShowList(img) {
    return (
      this.props.otherCertKeys.map((cert, key) => <ListMenu
        key = {key}
        title={cert.name}
        note = {cert.mtime}
        img = {img[key]}
        other
        nav={() => this.props.navigation.navigate("PropertiesCert", { cert: cert })} />));
  }

  render() {
    const { otherCertKeys} = this.props;
    const { goBack } = this.props.navigation;

    let img = [];
    for (let i = 0; i < otherCertKeys.length; i++) { // какое расширение у файлов
      switch (otherCertKeys[i].extension) {
        default:
          img[i] = require("../../imgs/general/cert2_ok_icon.png"); break;
      }
    }

    return (
      <Container style={styles.container}>
        <Headers title="Сертификаты других пользователей" src={require("../../imgs/general/back_icon.png")} goBack={() => goBack()}/>
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
    otherCertKeys: state.certKeys.otherCertKeys
  };
}

function mapDispatchToProps(dispatch) {
    return {
      readCertKeys: bindActionCreators(readCertKeys, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(OtherСert);