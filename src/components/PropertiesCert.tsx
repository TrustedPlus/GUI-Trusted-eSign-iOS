import * as React from "react";
import {Container, ListItem, View, List, Content, Text } from "native-base";
import {Image} from "react-native";
import {Headers} from "./Headers";
import {styles} from "../styles";
import * as RNFS from "react-native-fs";

interface PropertiesCertProps {
  navigation: any;
  cert: string;
}

export class PropertiesCert extends React.Component<PropertiesCertProps> {

  static navigationOptions = {
    header: null
  };

  render() {
    const { params } = this.props.navigation.state;
    const cert = params ? params.cert : null;
    const { navigate, goBack } = this.props.navigation;
    console.log(cert);
    let subjectFriendlyName = (cert.subjectName.match(/2.5.4.3=[^\/]{1,}/));
    if (subjectFriendlyName !== null) {
      subjectFriendlyName = (subjectFriendlyName[0].replace("2.5.4.3=", ""));
    }
    let subjectEmail = (cert.subjectName.match(/1.2.840.113549.1.9.1=[^\/]{1,}\//));
    if (subjectEmail !== null) {
      subjectEmail = (subjectEmail[0].replace("1.2.840.113549.1.9.1=", ""));
      subjectEmail = (subjectEmail.replace("/", ""));
    }
    let subjectCountry = (cert.subjectName.match(/2.5.4.6=[^\/]{1,}\//));
    if (subjectCountry !== null) {
      subjectCountry = (subjectCountry[0].replace("2.5.4.6=", ""));
      subjectCountry = (subjectCountry.replace("/", ""));
    }

    let subjectRegion = (cert.subjectName.match(/2.5.4.8=[^\/]{1,}\//));
    if (subjectRegion !== null) {
      subjectRegion = (subjectRegion[0].replace("2.5.4.8=", ""));
      subjectRegion = (subjectRegion.replace("/", ""));
    }

    let subjectCity = (cert.subjectName.match(/2.5.4.7=[^\/]{1,}\//));
    if (subjectCity !== null) {
      subjectCity = (subjectCity[0].replace("2.5.4.7=", ""));
      subjectCity = (subjectCity.replace("/", ""));
    }
    let issuerEmail = (cert.issuerName.match(/1.2.840.113549.1.9.1=[^\/]{1,}\//));
    if (issuerEmail !== null) {
      issuerEmail = (issuerEmail[0].replace("1.2.840.113549.1.9.1=", ""));
      issuerEmail = (issuerEmail.replace("/", ""));
    }
    let issuerCountry = (cert.issuerName.match(/2.5.4.6=[^\/]{1,}\//));
    if (issuerCountry !== null) {
      issuerCountry = (issuerCountry[0].replace("2.5.4.6=", ""));
      issuerCountry = (issuerCountry.replace("/", ""));
    }
    let issuerRegion = (cert.issuerName.match(/2.5.4.8=[^\/]{1,}\//));
    if (issuerRegion !== null) {
      issuerRegion = (issuerRegion[0].replace("2.5.4.8=", ""));
      issuerRegion = (issuerRegion.replace("/", ""));
    }
    let issuerCity = (cert.issuerName.match(/2.5.4.7=[^\/]{1,}\//));
    if (issuerCity !== null) {
      issuerCity = (issuerCity[0].replace("2.5.4.7=", ""));
      issuerCity = (issuerCity.replace("/", ""));
    }
    let organizationName = (cert.issuerName.match(/2.5.4.10=[^\/]{1,}\//));
    if (organizationName !== null) {
      organizationName = (organizationName[0].replace("2.5.4.10=", ""));
      organizationName = (organizationName.replace("/", ""));
    }
    return (
      <Container style={styles.container}>
        <Headers title="Свойства сертфиката" goBack={() => goBack()}/>
        <Content style={{backgroundColor: "white"}}>
        <View>
          <Image style={styles.prop_cert_img} source={require("../../imgs/general/cert_ok_icon.png")}/>
          <Text style={styles.prop_cert_title}>{cert.subjectFriendlyName}</Text>
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
            <Text style={styles.prop_cert_righttext}>{subjectFriendlyName}</Text>
          </ListItem>
          {subjectEmail ? <ListItem>
            <Text>Email:</Text>
            <Text style={styles.prop_cert_righttext}>{subjectEmail}</Text>
          </ListItem> : null}
          {cert.organizationName ? <ListItem>
            <Text>Огранизация:</Text>
            <Text style={styles.prop_cert_righttext}>{cert.organizationName}</Text>
          </ListItem> : null}
          {subjectCountry ? <ListItem last>
            <Text>Страна:</Text>
            <Text style={styles.prop_cert_righttext}>{subjectCountry}</Text>
          </ListItem> : null}
          {subjectRegion ?  <ListItem last>
            <Text>Регион:</Text>
            <Text style={styles.prop_cert_righttext}>{subjectRegion}</Text>
          </ListItem> : null}
          {subjectCity ? <ListItem last>
            <Text>Город:</Text>
            <Text style={styles.prop_cert_righttext}>{subjectCity}</Text>
          </ListItem> : null}
          <ListItem itemHeader>
            <Text>Издатель</Text>
          </ListItem>
          {cert.issuerFriendlyName ? <ListItem last>
            <Text>Имя:</Text>
            <Text style={styles.prop_cert_righttext}>{cert.issuerFriendlyName}</Text>
          </ListItem> : null}
          {issuerEmail ? <ListItem>
            <Text>Email:</Text>
            <Text style={styles.prop_cert_righttext}>{issuerEmail}</Text>
          </ListItem> : null}
          {organizationName ? <ListItem>
            <Text>Огранизация:</Text>
            <Text style={styles.prop_cert_righttext}>{organizationName}</Text>
          </ListItem> : null}
          {issuerCountry ? <ListItem last>
            <Text>Страна:</Text>
            <Text style={styles.prop_cert_righttext}>{issuerCountry}</Text>
          </ListItem> : null}
          {issuerRegion ? <ListItem last>
            <Text>Регион:</Text>
            <Text style={styles.prop_cert_righttext}>{issuerRegion}</Text>
          </ListItem> : null}
          {issuerCity ? <ListItem last>
            <Text>Город:</Text>
            <Text style={styles.prop_cert_righttext}>{issuerCity}</Text>
          </ListItem> : null}
          <ListItem itemHeader>
            <Text>Сертфикат</Text>
          </ListItem>
          <ListItem >
            <Text>Серийный номер:</Text>
            <Text style={styles.prop_cert_righttext}>{cert.serialNumber}</Text>
          </ListItem>
          <ListItem>
            <Text>Годен до:</Text>
            <Text style={styles.prop_cert_righttext}>{cert.notAfter}</Text>
          </ListItem>
          <ListItem>
            <Text style={{width: "50%"}}>Алгоритм подписи:</Text>
            <Text style={styles.prop_cert_righttext}>{cert.publicKeyAlgorithm}</Text>
          </ListItem>
          <ListItem>
            <Text>Хэш-алгоритм:</Text>
            <Text style={styles.prop_cert_righttext}>{cert.signatureDigestAlgorithm}</Text>
          </ListItem>
          <ListItem last>
            <Text>Закрытый ключ:</Text>
            <Text style={styles.prop_cert_righttext}>{cert.hasPrivateKey ? "присутствует" : "отсутствует" }</Text>
          </ListItem>
        </List>
        </Content>
      </Container>
    );
  }
}