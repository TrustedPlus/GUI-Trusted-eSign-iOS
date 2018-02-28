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

  render() {
    const { certKeys} = this.props;
    const { navigate, goBack } = this.props.navigation;

    let img = [];
    for (let i = 0; i < certKeys.id.length; i++) { // какое расширение у файлов
      switch (certKeys.extension[i]) {
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
          <ListMenu id={certKeys.id[0]} title={certKeys.title[0]} img={img[0]}
            note={certKeys.note[0]} check nav={() => goBack()}/>
          <ListMenu id={certKeys.id[1]} title={certKeys.title[1]} img={img[1]}
            note={certKeys.note[1]} check nav={() => goBack()}/>
          <ListMenu id={certKeys.id[2]} title={certKeys.title[2]} img={img[2]}
            note={certKeys.note[2]} check nav={() => goBack()}/>
          <ListMenu iid={certKeys.id[3]} title={certKeys.title[3]} img={img[3]}
            note={certKeys.note[3]} check nav={() => goBack()}/>
          <ListMenu iid={certKeys.id[4]} title={certKeys.title[4]} img={img[4]}
            note={certKeys.note[4]} check nav={() => goBack()}/>
        </List>
          {/*<List>
            <ListMenu title="GisJkh" img={require("../../imgs/general/cert2_ok_icon.png" )}
              check note="CRYPTO-PRO Test Center 2" rightimg={require("../../imgs/general/key_icon.png" )} nav={() => goBack()}/>
            <ListMenu title="shesnokov" img={require("../../imgs/general/cert2_ok_icon.png")}
              check note='Тестовый УЦ ООО "Крипто Про"' rightimg={require("../../imgs/general/key_icon.png" )} nav={() => goBack()}/>
            <ListMenu title="serji" img={require("../../imgs/general/cert2_bad_icon.png")}
              check note="serji" nav={() => goBack()}/>
          </List>*/}
        </Content>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    certKeys: state.certKeys
  };
}

export default connect(mapStateToProps)(SelectСert);