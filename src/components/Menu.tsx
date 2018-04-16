import * as React from "react";
import {Container, Header, Content, Left, Right, Button, Body, Title, List} from "native-base";
import {Text, Image} from "react-native";
import {Diagnostic} from "./Diagnostic";
import Signature from "./Signature";
import Encryption from "./Encryption";
import {Certificate} from "./Certificate";
import {Repository} from "./Repository";
import Journal from "./Journal";
import {styles} from "../styles";
import {StackNavigator} from "react-navigation";
import ListMenu from "./ListMenu";
import {License} from "./License";
import {Help} from "./Help";
import {DescriptionError} from "./DescriptionError";
import {Headers} from "./Headers";
import PersonalСert from "./PersonalСert";
import OtherСert from "./OtherCert";
import {PropertiesCert} from "./PropertiesCert";
import SelectPersonalСert from "./SelectPersonalСert";
import SelectOtherСert from "./SelectOtherСert";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {readCertKeys} from "../actions/CertKeysAction";
import {readFiles} from "../actions/index";

interface MainProps {
  navigation: any;
  files: any;
  pesronalCertKeys: any;
  lastlog: string;
  readCertKeys(): any;
  readFiles(): any;
}

class Main extends React.Component<MainProps> {

  static navigationOptions = {
    header: null
  };

  render() {
    const { navigate } = this.props.navigation;
    const {files, pesronalCertKeys, lastlog} = this.props;
    let length = "выбрано файлов: " + files.length;
    let persCert = "личных сертификатов: " + pesronalCertKeys.length;
    let lastlognote = lastlog ? "последняя запись: " + lastlog : "действий не совершалось";
    return (
      <Container style={styles.container}>
         <Header style={styles.header}>
          <Left style={styles.left}>
            <Button transparent onPress={() => navigate("DrawerOpen")}>
              <Image style={styles.headerImage} source={require("../../imgs/general/sidebar_icon.png")}/>
            </Button>
          </Left>
          <Body>
            <Title><Text style={{color: "white" }}>КриптоАрм ГОСТ</Text></Title>
          </Body>
          <Right style={styles.right}>
            <Button transparent>
              <Image style={styles.headerImage} source={require("../../imgs/general/setting_icon.png")}/>
            </Button>
          </Right>
        </Header>
        <Content>
          <List>
            {/*<ListMenu title="Диагностика приложения" img={require("../../imgs/general/diagnostic_main_icon.png" )}
              note="ошибок: 0" rightnote="замечаний: 0" nav={() => navigate("Diagnostic")}/>*/}
            <ListMenu title="Подпись / Проверка подписи" img={require("../../imgs/general/sign_main_icon.png")}
              note={length} nav={() => navigate("Signature")}/>
            <ListMenu title="Шифрование / Расшифрование" img={require("../../imgs/general/encode_main_icon.png")}
              note={length} nav={() => navigate("Encryption")}/>
            <ListMenu title="Управление сертификатами" img={require("../../imgs/general/certificates_main_icon.png")}
              note={persCert} nav={() => navigate("Certificate")}/>
            {/*<ListMenu title="Управление хранилищами" img={require("../../imgs/general/stores_main_icon.png")}
              note="подключенных хранилищ: 2" nav={() => navigate("Repository")}/>*/}
            <ListMenu title="Журнал операций" img={require("../../imgs/general/journal_main_icon.png")}
              note={lastlognote} nav={() => navigate("Journal")}/>
          </List>
        </Content>
      </Container>
    );
  }

  componentDidMount() {
    if (this.props.files.length === 0) { this.props.readFiles(); }
    if (this.props.pesronalCertKeys.length === 0) { this.props.readCertKeys(); }
  }
}

function mapStateToProps(state) {
  return {
    pesronalCertKeys: state.certKeys.pesronalCertKeys,
    files: state.files.files,
    lastlog: state.files.lastlog
  };
}

function mapDispatchToProps (dispatch) {
  return {
    readFiles: bindActionCreators(readFiles, dispatch),
    readCertKeys: bindActionCreators(readCertKeys, dispatch)
  };
}

export const menu = StackNavigator({
  Main: {screen: connect(mapStateToProps, mapDispatchToProps)(Main)},
  Diagnostic: {screen: Diagnostic},
  Signature: {screen: Signature},
  Encryption: {screen: Encryption},
  Certificate: {screen: Certificate},
  Repository: {screen: Repository},
  Journal: {screen: Journal},
  License: { screen: License},
  Help: { screen: Help},
  DescriptionError: { screen: DescriptionError},
  PersonalСert: {screen: PersonalСert},
  OtherСert: {screen: OtherСert},
  PropertiesCert: {screen: PropertiesCert},
  SelectPersonalСert: {screen: SelectPersonalСert},
  SelectOtherСert: {screen: SelectOtherСert}
});