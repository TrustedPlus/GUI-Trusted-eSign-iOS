import * as React from "react";
import { Container, View, List, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from "native-base";
import {StyleSheet, TouchableOpacity, TouchableHighlight, Image} from "react-native";
import {Headers} from "./Headers";
import {styles} from "../styles";
import {SelectСert} from "./SelectСert";
import {ListMenu} from "./ListMenu";

interface SignatureProps {
  navigation: any;
}

export class Signature extends React.Component<SignatureProps, any> {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {footer: false};
  }

  render() {
    const { navigate, goBack } = this.props.navigation;

    let footer = null;
      if (this.state.footer) {
        footer = <Footer>
        <FooterTab>
          <Button vertical>
            <Icon name="apps" />
            <Text>Проверить</Text>
          </Button>
          <Button vertical>
            <Icon name="camera" />
            <Text>Подписать</Text>
          </Button>
          <Button vertical>
            <Icon name="navigate" />
            <Text>Отправить</Text>
          </Button>
          <Button vertical>
            <Icon name="person" />
            <Text>Операции</Text>
          </Button>
        </FooterTab>
      </Footer>;
      }
    return (
      <Container>
        <Headers title="Подпись/проверка" goBack={() => goBack()}/>
        <Content style={{backgroundColor: "white"}}>
          <View style={styles.sign_view}>
            <Text style={{fontSize: 23, color: "grey", width: "80%"}}>Сертификат подписи</Text>
            <Button transparent onPress={() => navigate("SelectСert")} style={{position: "absolute", marginTop: 6, right: 10}}>
              <Image style={styles.headerImage} source={require("../../imgs/general/add_icon.png")}/>
            </Button>
          </View>
          <Body>
          <View style={[styles.sign_view, {paddingBottom: 40}]}>
            <Text style={{fontSize: 17, color: "lightgrey"}}>[Добавьте сертификат подписчика]</Text>
          </View>
          </Body>
          <View style={styles.sign_view}>
            <Text style={{fontSize: 23, color: "grey", width: "70%"}}>Файлы</Text>
            <Button transparent style={{position: "absolute", marginTop: 6, right: 10}}>
              <Image style={styles.headerImage} source={require("../../imgs/general/add_icon.png")}/>
            </Button>
          </View>
            <List>
              <ListMenu title="Договор №2332" img={require("../../imgs/general/file_pdf.png")}
              note="12 января 2018, 02:34:22" nav={() => {this.setState({footer: !this.state.footer}); console.log(this.state.footer); }}/>
              <ListMenu title="Письмо от 23.08.2018" img={require("../../imgs/general/file_txt.png")}
              note="12 января 2018, 02:36:38" nav={() => this.setState({footer: !this.state.footer})}/>
              <ListMenu title="Договор №2332 с приложениями" img={require("../../imgs/general/file_zip.png")}
              note="6 января 2018, 13:49:26" nav={() => this.setState({footer: !this.state.footer})}/>
              <ListMenu title="Заключение от поставке" img={require("../../imgs/general/file_docx.png")}
              note="6 января 2018, 14:28:18" nav={() => this.setState({footer: !this.state.footer})}/>
            </List>
        </Content>
        {footer}
      </Container>
    );
  }
}