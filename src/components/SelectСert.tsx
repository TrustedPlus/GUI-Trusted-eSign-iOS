import * as React from "react";
import {Container, Header, Item, Input, List, Content, Icon, Text } from "native-base";
import {Headers} from "./Headers";
import ListMenu from "./ListMenu";
import {styles} from "../styles";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

interface SelectСertProps {
  navigation: any;
  certKeys: any;
}

class SelectСert extends React.Component<SelectСertProps> {

  static navigationOptions = {
    header: null
  };

  ShowList(img) {
    return (
      this.props.certKeys.map((file, key) => <ListMenu
        key = {key}
        title={file.name}
        note = {file.mtime}
        img = {img[key]}
        check
        nav={() => this.props.navigation.goBack()} />));
  }

  render() {
    const { certKeys} = this.props;
    const { goBack } = this.props.navigation;

    let img = [];
    for (let i = 0; i < certKeys.length; i++) { // какое расширение у файлов
      switch (certKeys[i].extension) {
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
}

function mapStateToProps(state) {
  return {
    certKeys: state.certKeys.certKeys
  };
}

export default connect(mapStateToProps)(SelectСert);