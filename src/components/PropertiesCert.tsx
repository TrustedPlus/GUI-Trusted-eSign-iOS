import * as React from "react";
import {Container, ListItem, View, List, Content, Text } from "native-base";
import {NativeModules} from "react-native";
import {Image} from "react-native";
import {Headers} from "./Headers";
import {styles} from "../styles";
import * as RNFS from "react-native-fs";

interface PropertiesCertProps {
  navigation: any;
  cert: string;
}

interface PropertiesCertState {
  getVersionLabel: string;
  getSerialNumberLabel: string;
  getNotBeforeLabel: string;
  getNotAfterLabel: string;
  getIssuerFriendlyNameLabel: string;
  getIssuerNameLabel: string;
  getSubjectFriendlyNameLabel: string;
  getSubjectNameLabel: string;
  getPublicKeyAlgorithmLabel: string;
  getSignatureAlgorithLabel: string;
  getSignatureDigestAlgorithmLabel: string;
  getOrganizationNameLabel: string;
  getThumbprintLabel: string;
}

export class PropertiesCert extends React.Component<PropertiesCertProps, PropertiesCertState> {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
        getVersionLabel: "",
        getSerialNumberLabel: "",
        getNotBeforeLabel: "",
        getNotAfterLabel: "",
        getIssuerFriendlyNameLabel: "",
        getIssuerNameLabel: "",
        getSubjectFriendlyNameLabel: "",
        getSubjectNameLabel: "",
        getThumbprintLabel: "",
        getPublicKeyAlgorithmLabel: "",
        getSignatureAlgorithLabel: "",
        getSignatureDigestAlgorithmLabel: "",
        getOrganizationNameLabel: ""
    };
    this.onPressShowCert = this.onPressShowCert.bind(this);
  }

  onPressLoad(cert, where) {
    let format;
    switch (cert.extension) {
        case "cer":
            format = "DER";
            break;
        case "crt":
            format = "BASE64";
            break;
        default: break;
    }
    if (where === "personal") {
      NativeModules.WCert.Load(
        RNFS.DocumentDirectoryPath + "/PersonalCertKeys/" + cert.name + "." + cert.extension,
        format,
        (err, load) => null);
    } else if (where === "other") {
      NativeModules.WCert.Load(
        RNFS.DocumentDirectoryPath + "/OtherCertKeys/" + cert.name + "." + cert.extension,
        format,
        (err, load) => null);
    }
  }

  onPressShowCert() {
    NativeModules.WCert.getVersion((err, name) => {
      this.setState({getVersionLabel: name});
    });
    NativeModules.WCert.getSerialNumber((err, name) => {
      this.setState({getSerialNumberLabel: name});
    });
    NativeModules.WCert.getNotBefore((err, name) => {
      this.setState({getNotBeforeLabel: name});
    });
    NativeModules.WCert.getNotAfter((err, name) => {
      this.setState({getNotAfterLabel: name});
    });
    NativeModules.WCert.getIssuerFriendlyName((err, name) => {
      this.setState({getIssuerFriendlyNameLabel: name});
    });
    NativeModules.WCert.getIssuerName((err, name) => {
      this.setState({getIssuerNameLabel: name});
    });
    NativeModules.WCert.getSubjectFriendlyName((err, name) => {
      this.setState({getSubjectFriendlyNameLabel: name});
    });
    NativeModules.WCert.getSubjectName((err, name) => {
      this.setState({getSubjectNameLabel: name});
    });
    NativeModules.WCert.getPublicKeyAlgorithm((err, name) => {
      this.setState({getPublicKeyAlgorithmLabel: name});
    });
    NativeModules.WCert.getSignatureAlgorithm((err, name) => {
      this.setState({getSignatureAlgorithLabel: name});
    });
    NativeModules.WCert.getSignatureDigestAlgorithm((err, name) => {
      this.setState({getSignatureDigestAlgorithmLabel: name});
    });
    NativeModules.WCert.getOrganizationName((err, name) => {
      this.setState({getOrganizationNameLabel: name});
    });
    NativeModules.WCert.getThumbprint((err, name) => {
      this.setState({getThumbprintLabel: name}, function() {console.log("State", this.state); });
    });
  }

  render() {
    const { params } = this.props.navigation.state;
    const cert = params ? params.cert : null;
    const where = params ? params.where : null;
    const { navigate, goBack } = this.props.navigation;
    this.onPressLoad(cert, where);
    return (
      <Container style={styles.container}>
        <Headers title="Свойства сертфиката" src={require("../../imgs/general/back_icon.png")} goBack={() => goBack()}/>
        <Content style={{backgroundColor: "white"}}>
        <View>
          <Image style={styles.prop_cert_img} source={require("../../imgs/general/cert_ok_icon.png")}/>
          <Text style={styles.prop_cert_title}>{cert.name}</Text>
          <Text style={styles.prop_cert_status}>Cтатус сертификата:
            <Text style={{color: "green"}}> действителен</Text>
          </Text>
        </View>
        <List>
          <ListItem itemHeader first>
            <Text>Владелец</Text>
          </ListItem>
          <ListItem >
            <Text>Имя:</Text>
            <Text style={styles.prop_cert_righttext}>{this.state.getIssuerFriendlyNameLabel}</Text>
          </ListItem>
          <ListItem>
            <Text>Email:</Text>
            <Text style={styles.prop_cert_righttext}>shesnokov@gmail.com</Text>
          </ListItem>
          <ListItem>
            <Text>Огранизация:</Text>
            <Text style={styles.prop_cert_righttext}>{this.state.getOrganizationNameLabel}</Text>
          </ListItem>
          <ListItem last>
            <Text>Страна:</Text>
            <Text style={styles.prop_cert_righttext}>RU</Text>
          </ListItem>
          <ListItem itemHeader>
            <Text>Издатель</Text>
          </ListItem>
          <ListItem last>
            <Text>Имя:</Text>
            <Text style={styles.prop_cert_righttext}>Тестовый УЦ ООО "Крипто Про"</Text>
          </ListItem>
          <ListItem itemHeader>
            <Text>Сертфикат</Text>
          </ListItem>
          <ListItem >
            <Text>Серийный номер:</Text>
            <Text style={styles.prop_cert_righttext}>{this.state.getSerialNumberLabel}</Text>
          </ListItem>
          <ListItem>
            <Text>Годен до:</Text>
            <Text style={styles.prop_cert_righttext}>{this.state.getNotAfterLabel}</Text>
          </ListItem>
          <ListItem>
            <Text style={{width: "50%"}}>Алгоритм подписи:</Text>
            <Text style={styles.prop_cert_righttext}>{this.state.getPublicKeyAlgorithmLabel}</Text>
          </ListItem>
          <ListItem>
            <Text>Хэш-алгоритм:</Text>
            <Text style={styles.prop_cert_righttext}>{this.state.getSignatureDigestAlgorithmLabel}</Text>
          </ListItem>
          <ListItem last>
            <Text>Закрытый ключ:</Text>
            <Text style={styles.prop_cert_righttext}>присутствует</Text>
          </ListItem>
        </List>
        </Content>
      </Container>
    );
  }

  componentDidMount() {
    this.onPressShowCert();
  }
}