import * as React from "react";
import { Container, ListItem, View, List, Content, Text, Footer, FooterTab, Button } from "native-base";
import { Image, NativeModules, Share, Alert, AlertIOS } from "react-native";
import { Headers } from "../components/Headers";
import { styles } from "../styles";
import * as RNFS from "react-native-fs";
import { FooterButton } from "../components/FooterButton";

import { readCertKeys } from "../actions/CertKeysAction";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

function mapDispatchToProps(dispatch) {
   return {
      readCertKeys: bindActionCreators(readCertKeys, dispatch)
   };
}

interface ListForCertProps {
   title: string;
   value?: string;
   first?: boolean;
   itemHeader?: boolean;
}

class ListForCert extends React.Component<ListForCertProps> {

   render() {
      return (
         <ListItem first={this.props.first} itemHeader={this.props.itemHeader}>
            <Text style={{ width: "50%" }}>{this.props.title}</Text>
            {this.props.value ? <Text style={styles.prop_cert_righttext}>{this.props.value}</Text> : null}
         </ListItem>
      );
   }
}

interface PropertiesCertProps {
   navigation: any;
   cert: string;
   readCertKeys(): void;
}

@(connect(null, mapDispatchToProps) as any)
export class PropertiesCert extends React.Component<PropertiesCertProps> {

   static navigationOptions = {
      header: null
   };
/*
   exportCert() {
      AlertIOS.alert(
         "Экспортировать с ключем",
         null,
         [
            { text: "Импортировать сертификат", onPress: () => this.documentPicker() },
            { text: "Создать самоподписаный сертификат", onPress: () => this.props.navigate("CreateCertificate") },
            { text: "Отмена", onPress: () => null, style: "cancel" }
         ]
      );
      NativeModules.Wrap_Cert.load(
         this.props.navigation.state.params.cert.serialNumber,
         this.props.navigation.state.params.cert.provider,
         (err, load) => {
            if (err) {
               Alert.alert(err + "");
            } else {
               let path = RNFS.DocumentDirectoryPath + "/" + this.props.navigation.state.params.cert.subjectFriendlyName + ".cer";
               NativeModules.Wrap_Cert.save(
                  path,
                  "BASE64",
                  (err, load) => {
                     if (err) {
                        Alert.alert(err + "");
                     } else {
                        Share.share({
                           url: path
                        }).then(
                           result => {
                              RNFS.unlink(path);
                           }
                        ).catch(
                           errorMsg => Alert.alert("Ошибка при экспорте сертификата")
                        );
                     }
                  });
            }
         });
   }*/

   deleteCert() {
      NativeModules.Wrap_Cert.deleteCertInStore(
         this.props.navigation.state.params.cert.serialNumber,
         this.props.navigation.state.params.cert.category,
         this.props.navigation.state.params.cert.provider,
         (err, deleteCert) => {
            if (err) {
               Alert.alert("err: " + err);
            } else {
               AlertIOS.alert(
                  "Сертификат был успешно удален",
                  null,
                  [
                     { text: "Ок", onPress: () => { this.props.readCertKeys(); this.props.navigation.goBack(); } },
                  ]
               );
            }
         });
   }

   render() {
      const { cert } = this.props.navigation.state.params;
      const { navigate, goBack } = this.props.navigation;
      let subjectFriendlyName, subjectEmail, subjectCountry, subjectRegion, subjectCity;
      if (!cert.selfSigned) {
         subjectFriendlyName = (cert.subjectName.match(/2.5.4.3=[^\/]{1,}/));
         if (subjectFriendlyName !== null) {
            subjectFriendlyName = (subjectFriendlyName[0].replace("2.5.4.3=", ""));
         }
         subjectEmail = (cert.subjectName.match(/1.2.840.113549.1.9.1=[^\/]{1,}/));
         if (subjectEmail !== null) {
            subjectEmail = (subjectEmail[0].replace("1.2.840.113549.1.9.1=", ""));
         }
         subjectCountry = (cert.subjectName.match(/2.5.4.6=[^\/]{1,}/));
         if (subjectCountry !== null) {
            subjectCountry = (subjectCountry[0].replace("2.5.4.6=", ""));
         }

         subjectRegion = (cert.subjectName.match(/2.5.4.8=[^\/]{1,}/));
         if (subjectRegion !== null) {
            subjectRegion = (subjectRegion[0].replace("2.5.4.8=", ""));
         }

         subjectCity = (cert.subjectName.match(/2.5.4.7=[^\/]{1,}/));
         if (subjectCity !== null) {
            subjectCity = (subjectCity[0].replace("2.5.4.7=", ""));
         }
      }
      let issuerEmail = (cert.issuerName.match(/1.2.840.113549.1.9.1=[^\/]{1,}/));
      if (issuerEmail !== null) {
         issuerEmail = (issuerEmail[0].replace("1.2.840.113549.1.9.1=", ""));
      }
      let issuerCountry = (cert.issuerName.match(/2.5.4.6=[^\/]{1,}/));
      if (issuerCountry !== null) {
         issuerCountry = (issuerCountry[0].replace("2.5.4.6=", ""));
      }
      let issuerRegion = (cert.issuerName.match(/2.5.4.8=[^\/]{1,}/));
      if (issuerRegion !== null) {
         issuerRegion = (issuerRegion[0].replace("2.5.4.8=", ""));
      }
      let issuerCity = (cert.issuerName.match(/2.5.4.7=[^\/]{1,}/));
      if (issuerCity !== null) {
         issuerCity = (issuerCity[0].replace("2.5.4.7=", ""));
      }
      let organizationName = (cert.issuerName.match(/2.5.4.10=[^\/]{1,}/));
      if (organizationName !== null) {
         organizationName = (organizationName[0].replace("2.5.4.10=", ""));
      }
      let isValidnew = new Date().getTime() < new Date(cert.notAfter).getTime() ? true : false;
      return (
         <Container style={styles.container}>
            <Headers title="Свойства сертфиката" goBack={() => goBack()} />
            <Content style={{ backgroundColor: "white" }}>
               <View>
                  <Image style={styles.prop_cert_img} source={isValidnew ? require("../../imgs/general/cert_ok_icon.png") : require("../../imgs/general/cert_bad_icon.png")} />
                  <Text style={styles.prop_cert_title}>{cert.subjectFriendlyName}</Text>
                  <Text style={styles.prop_cert_status}>Cтатус сертификата:{"\n"}
                     {isValidnew ? <Text style={{ color: "green" }}>действителен</Text> : <Text style={{ color: "red" }}>не действителен</Text>}
                  </Text>
               </View>
               <List>
                  {cert.selfSigned ? null : <>
                     <ListForCert itemHeader first title="Владелец" />
                     <ListForCert title="Имя:" value={subjectFriendlyName} />
                     {subjectEmail ? <ListForCert title="Email:" value={subjectEmail} /> : null}
                     {cert.organizationName ? <ListForCert title="Огранизация:" value={cert.organizationName} /> : null}
                     {subjectCountry ? <ListForCert title="Страна:" value={subjectCountry} /> : null}
                     {subjectRegion ? <ListForCert title="Регион:" value={subjectRegion} /> : null}
                     {subjectCity ? <ListForCert title="Город:" value={subjectCity} /> : null}
                  </>}
                  <ListForCert itemHeader first title={"Издатель " + [cert.selfSigned ? "и владелец" : null]} />
                  <ListForCert title="Имя:" value={cert.issuerFriendlyName} />
                  {issuerEmail ? <ListForCert title="Email:" value={issuerEmail} /> : null}
                  {organizationName ? <ListForCert title="Огранизация:" value={organizationName} /> : null}
                  {issuerCountry ? <ListForCert title="Страна:" value={issuerCountry} /> : null}
                  {issuerRegion ? <ListForCert title="Регион:" value={issuerRegion} /> : null}
                  {issuerCity ? <ListForCert title="Город:" value={issuerCity} /> : null}

                  <ListForCert itemHeader title="Сертфикат" />
                  <ListForCert title="Серийный номер:" value={cert.serialNumber} />
                  <ListForCert title="Годен до:" value={cert.notAfter} />
                  <ListForCert title="Алгоритм подписи:" value={cert.publicKeyAlgorithm} />
                  <ListForCert title="Хэш-алгоритм:" value={cert.signatureDigestAlgorithm} />
                  <ListForCert title="Закрытый ключ:" value={cert.hasPrivateKey ? "присутствует" : "отсутствует"} />
               </List>
            </Content>
            <Footer>
               <FooterTab>
                  <FooterButton title="Экспортировать"
                     icon="ios-share-alt-outline"
                     nav={() => navigate("ExportCert", {cert: cert})} />
                  <FooterButton title="Удалить" icon="md-trash" nav={() => this.deleteCert()} />
               </FooterTab>
            </Footer>
         </Container>
      );
   }
}