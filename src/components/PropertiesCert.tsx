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
    let email = (cert.issuerName.match(/1.2.840.113549.1.9.1=[a-zA-z.@]{1,}\//));
    if (email !== null) {
      email = (email[0].replace("1.2.840.113549.1.9.1=", ""));
      email = (email.replace("/", ""));
    } else { email = "не назначен"; }
    return (
      <Container style={styles.container}>
        <Headers title="Свойства сертфиката" src={require("../../imgs/general/back_icon.png")} goBack={() => goBack()}/>
        <Content style={{backgroundColor: "white"}}>
        <View>
          <Image style={styles.prop_cert_img} source={require("../../imgs/general/cert_ok_icon.png")}/>
          <Text style={styles.prop_cert_title}>{cert.issuerFriendlyName}</Text>
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
            <Text style={styles.prop_cert_righttext}>{cert.issuerFriendlyName}</Text>
          </ListItem>
          <ListItem>
            <Text>Email:</Text>
            <Text style={styles.prop_cert_righttext}>{email}</Text>
          </ListItem>
          <ListItem>
            <Text>Огранизация:</Text>
            <Text style={styles.prop_cert_righttext}>{cert.organizationName}</Text>
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