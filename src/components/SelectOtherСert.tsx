import * as React from "react";
import {Container, Header, Item, Input, List, Content, Icon, Text } from "native-base";
import {Headers} from "./Headers";
import ListMenu from "./ListMenu";
import {styles} from "../styles";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

interface SelectOtherСertProps {
  navigation: any;
  otherCertKeys: any;
}

class SelectOtherСert extends React.Component<SelectOtherСertProps> {

  static navigationOptions = {
    header: null
  };

  ShowList(img) {
    return (
      this.props.otherCertKeys.map((file, key) => <ListMenu
        key = {key}
        title={file.name}
        note = {file.mtime}
        img = {img[key]}
        other
        nav={() => this.props.navigation.goBack()} />));
  }

  render() {
    const { otherCertKeys} = this.props;
    const { goBack } = this.props.navigation;
    console.log(this.props);
    let img = [];
    for (let i = 0; i < otherCertKeys.length; i++) { // какое расширение у файлов
      switch (otherCertKeys[i].extension) {
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
    otherCertKeys: state.certKeys.otherCertKeys
  };
}

export default connect(mapStateToProps)(SelectOtherСert);