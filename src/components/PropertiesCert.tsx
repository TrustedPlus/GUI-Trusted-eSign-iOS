import * as React from "react";
import { Container, ListItem, View, List, Content, Text } from "native-base";
import { Image } from "react-native";
import { Headers } from "./Headers";
import { styles } from "../styles";
import * as RNFS from "react-native-fs";

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
      let subjectFriendlyName, subjectEmail, subjectCountry, subjectRegion, subjectCity;
      if (!cert.selfSigned) {
         subjectFriendlyName = (cert.subjectName.match(/2.5.4.3=[^\/]{1,}/));
         if (subjectFriendlyName !== null) {
            subjectFriendlyName = (subjectFriendlyName[0].replace("2.5.4.3=", ""));
         }
         subjectEmail = (cert.subjectName.match(/1.2.840.113549.1.9.1=[^\/]{1,}\//));
         if (subjectEmail !== null) {
            subjectEmail = (subjectEmail[0].replace("1.2.840.113549.1.9.1=", ""));
            subjectEmail = (subjectEmail.replace("/", ""));
         }
         subjectCountry = (cert.subjectName.match(/2.5.4.6=[^\/]{1,}\//));
         if (subjectCountry !== null) {
            subjectCountry = (subjectCountry[0].replace("2.5.4.6=", ""));
            subjectCountry = (subjectCountry.replace("/", ""));
         }

         subjectRegion = (cert.subjectName.match(/2.5.4.8=[^\/]{1,}\//));
         if (subjectRegion !== null) {
            subjectRegion = (subjectRegion[0].replace("2.5.4.8=", ""));
            subjectRegion = (subjectRegion.replace("/", ""));
         }

         subjectCity = (cert.subjectName.match(/2.5.4.7=[^\/]{1,}\//));
         if (subjectCity !== null) {
            subjectCity = (subjectCity[0].replace("2.5.4.7=", ""));
            subjectCity = (subjectCity.replace("/", ""));
         }
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
            <Headers title="Свойства сертфиката" goBack={() => goBack()} />
            <Content style={{ backgroundColor: "white" }}>
               <View>
                  <Image style={styles.prop_cert_img} source={require("../../imgs/general/cert_ok_icon.png")} />
                  <Text style={styles.prop_cert_title}>{cert.subjectFriendlyName}</Text>
                  <Text style={styles.prop_cert_status}>Cтатус сертификата:
                     <Text style={{ color: "green" }}> действителен</Text>
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
                  {issuerEmail ? <ListForCert title="Email:" value={issuerEmail} /> : null}
                  {organizationName ? <ListForCert title="Огранизация:" value={organizationName} /> : null}
                  {issuerCountry ? <ListForCert title="Страна:" value={issuerCountry} /> : null}
                  {issuerRegion ? <ListForCert title="Регион:" value={issuerRegion} /> : null}
                  {issuerCity ? <ListForCert title="Город:" value={issuerCity} /> : null}

                  <ListForCert itemHeader title="Сертфикат"/>
                  <ListForCert title="Серийный номер:" value={cert.serialNumber}/>
                  <ListForCert title="Годен до:" value={cert.notAfter}/>
                  <ListForCert title="Алгоритм подписи:" value={cert.publicKeyAlgorithm}/>
                  <ListForCert title="Хэш-алгоритм:" value={cert.signatureDigestAlgorithm}/>
                  <ListForCert title="Закрытый ключ:" value={cert.hasPrivateKey ? "присутствует" : "отсутствует"}/>
               </List>
            </Content>
         </Container>
      );
   }
}