import * as React from "react";
import { Container, Item, CheckBox, Input, Footer, FooterTab, Button, List, ListItem, Header, Title, Text, Content, Icon, Right, Body, Left, Form, NativeBase } from "native-base";
import { Headers } from "./Headers";
import { styles } from "../styles";
import { View, Slider, Switch, Alert, NativeModules, Picker } from "react-native";
import * as RNFS from "react-native-fs";
const ModalDropdown = require("react-native-modal-dropdown");

interface ListWithSwitchProps {
   text: string;
   value: boolean;
   changeValue: any;
   last?: boolean;
}

class ListWithSwitch extends React.Component<ListWithSwitchProps> {

   render() {
      return (
         <List>
            <ListItem icon last={this.props.last}>
               <Body>
                  <Text>{this.props.text}</Text>
               </Body>
               <Right>
                  <Switch
                     onValueChange={this.props.changeValue}
                     value={this.props.value} />
               </Right>
            </ListItem>
         </List>
      );
   }
}

interface ListWithModalDropdownProps {
   text: string;
   defaultValue: string;
   changeValue: any;
   options: string[];
}

class ListWithModalDropdown extends React.Component<ListWithModalDropdownProps> {

   render() {
      return (
         <List>
            <ListItem icon >
               <Body>
                  <Text>{this.props.text}</Text>
               </Body>
               <Right>
                  <ModalDropdown defaultValue={this.props.defaultValue}
                                 onSelect={this.props.changeValue}
                                 options={this.props.options}
                                 textStyle={{fontSize: 16}}
                                 dropdownStyle={{width: 230}}
                                 dropdownTextStyle={{fontSize: 16}}
                                 />
               </Right>
            </ListItem>
         </List>
      );
   }
}

interface CreateCertificateState {
   algorithm: any;
   keyLength: number;
   hideKeyProp: boolean;
   dataEncipherment: boolean;
   keyAgreement: boolean;
   keyCertSign: boolean;
   decipherOnly: boolean;
   encipherOnly: boolean;
   digitalSignature: boolean;
   nonRepudiation: boolean;
   cRLSign: boolean;
   keyEncipherment: boolean;
   keyAssignment: boolean;
   server_auth: boolean;
   client_auth: boolean;
   code_sign: boolean;
   email_protection: boolean;
   CN: string;
   email: string;
   org: string;
   city: string;
   obl: string;
   country: string;
   errorInputCN: boolean;
   errorInputEmail: boolean;
   errorInputCountry: boolean;
}

interface CreateCertificateProps {
   navigation: any;
}

export class CreateCertificate extends React.Component<CreateCertificateProps, CreateCertificateState> {

   static navigationOptions = {
      header: null
   };

   constructor(props) {
      super(props);
      this.state = {
         algorithm: "RSA",
         keyLength: 512,
         hideKeyProp: true,
         dataEncipherment: true,
         keyAgreement: true,
         keyCertSign: true,
         decipherOnly: false,
         encipherOnly: false,
         digitalSignature: true,
         nonRepudiation: true,
         cRLSign: false,
         keyEncipherment: false,
         keyAssignment: true,
         server_auth: false,
         client_auth: true,
         code_sign: false,
         email_protection: true,
         CN: "",
         email: "",
         org: "",
         city: "",
         obl: "",
         country: "",
         errorInputCN: false,
         errorInputEmail: false,
         errorInputCountry: false
      };
      this.onPressCertRequest = this.onPressCertRequest.bind(this);
   }

   onValueChange(value: string) {
      this.setState({
         algorithm: value
      });
   }

   onPressCertRequest() {
      if ((this.state.CN !== "") || (this.state.email !== "") || (this.state.country !== "")) {
      NativeModules.Wrap_CertRequest.genRequestOnCert(
         "RSA",
         Number(this.state.keyLength),
         // использование ключа
         [this.state.dataEncipherment, // шифрование
         this.state.keyAgreement, // согласование
         this.state.keyCertSign, // подпись сертификатов
         this.state.decipherOnly, // только расшифрование
         this.state.encipherOnly, // только шифрование
         this.state.digitalSignature, // подпись
         this.state.nonRepudiation, // неотрекаемость
         this.state.cRLSign, // автономное подписание списка отзывов
         this.state.keyEncipherment], // шифрование ключа
         //  назначение сертификата (EKU)
         [this.state.server_auth, // проверка подлинности сервера
         this.state.client_auth, // проверка подлинности клиента
         this.state.code_sign, // подпись кода
         this.state.email_protection], // защита элкетронной почты
         // параметры субъекта
         this.state.CN,
         this.state.email,
         this.state.org,
         this.state.city,
         this.state.obl,
         this.state.country,
         RNFS.DocumentDirectoryPath + "/Files" + "/certRequest.txt",
         RNFS.DocumentDirectoryPath + "/Files" + "/key.key",
         (err, verify) => {
            if (err) {
               Alert.alert(err);
            } else {
               NativeModules.Wrap_CertRequest.genSelfSignedCert(
                  RNFS.DocumentDirectoryPath + "/Files" + "/certRequest.txt",
                  RNFS.DocumentDirectoryPath + "/Files" + "/cert.cer",
                  RNFS.DocumentDirectoryPath + "/Files" + "/key.key",
                  (err, verify) => {
                     if (err) {
                        Alert.alert(err);
                     } else {
                        RNFS.unlink(RNFS.DocumentDirectoryPath + "/Files" + "/certRequest.txt");
                        RNFS.unlink(RNFS.DocumentDirectoryPath + "/Files" + "/cert.cer");
                        RNFS.unlink(RNFS.DocumentDirectoryPath + "/Files" + "/key.key"),
                           Alert.alert("Сертификат и ключ создан");
                     }
                  });
            }
         });
      } else {
         this.state.CN === "" ? this.setState({errorInputCN: true}) : null;
         this.state.email === "" ? this.setState({errorInputEmail: true}) : null;
         this.state.country === "" ? this.setState({errorInputCountry: true}) : null;
         Alert.alert("Необходимые поля не заполнены");
      }
   }

   render() {
      const { navigate, goBack } = this.props.navigation;
      const FixedPicker: any = Picker;
      console.log(this.state);
      return (
         <Container style={styles.container}>
            <Headers title="Создание сертификата" goBack={() => goBack()} />
            <Content>
            <ListWithModalDropdown text="Алгоритм" defaultValue="RSA" changeValue={(index, value) => this.setState({ algorithm: value })} options={["RSA", "ГОСТ Р 34.10-2001", "ГОСТ Р 34.10-2012 256 бит", "ГОСТ Р 34.10-2012 512 бит"]}/>
            <ListWithModalDropdown text="Длина ключа" defaultValue="512" changeValue={(index, value) => this.setState({ keyLength: value })} options={["512", "1024", "2048", "3072", "4096"]}/>
               <View style={styles.sign_enc_view}>
                  <Text style={{ color: "grey" }}>Параметры субъекта</Text>
               </View>
               <Form>
                  <Item error={this.state.errorInputCN ? true : false} >
                     <Input onChangeText={(CN) => this.setState({ CN })} placeholder="CN" />
                  </Item>
                  <Item error={this.state.errorInputEmail ? true : false}>
                     <Input onChangeText={(email) => this.setState({ email })} placeholder="Email адрес" />
                  </Item>
                  <Item >
                     <Input onChangeText={(org) => this.setState({ org })} placeholder="Организация" />
                  </Item>
                  <Item >
                     <Input onChangeText={(city) => this.setState({ city })} placeholder="Город" />
                  </Item>
                  <Item>
                     <Input onChangeText={(obl) => this.setState({ obl })} placeholder="Область" />
                  </Item>
                  <Item error={this.state.errorInputCountry ? true : false} last>
                     <Input onChangeText={(country) => this.setState({ country })} placeholder="Страна" />
                  </Item>
               </Form>
               <Button style={{ width: "100%", backgroundColor: "white" }} onPress={() => this.setState({ hideKeyProp: !this.state.hideKeyProp })}>
                  <Text style={{ color: "grey" }}>Использование ключа</Text>
                  {this.state.hideKeyProp ? <Icon style={{ color: "grey", position: "absolute", right: "5%" }} name="ios-arrow-down" /> :
                     <Icon style={{ color: "grey", position: "absolute", right: "5%" }} name="ios-arrow-up" />}
               </Button>
               {!this.state.hideKeyProp ? <>
                  <ListWithSwitch text="Шифрование" value={this.state.dataEncipherment} changeValue={() => this.setState({ dataEncipherment: !this.state.dataEncipherment })} />
                  <ListWithSwitch text="Согласование" value={this.state.keyAgreement} changeValue={() => this.setState({ keyAgreement: !this.state.keyAgreement })} />
                  <ListWithSwitch text="Подпись сертификатов" value={this.state.keyCertSign} changeValue={() => this.setState({ keyCertSign: !this.state.keyCertSign })} />
                  <ListWithSwitch text="Только расшифрование" value={this.state.decipherOnly} changeValue={() => this.setState({ decipherOnly: !this.state.decipherOnly })} />
                  <ListWithSwitch text="Подпись" value={this.state.digitalSignature} changeValue={() => this.setState({ digitalSignature: !this.state.digitalSignature })} />
                  <ListWithSwitch text="Неотрекаемость" value={this.state.nonRepudiation} changeValue={() => this.setState({ nonRepudiation: !this.state.nonRepudiation })} />
                  <ListWithSwitch text="Автономное подписание списка отзывов" value={this.state.cRLSign} changeValue={() => this.setState({ cRLSign: !this.state.cRLSign })} />
                  <ListWithSwitch text="Шифрование ключа" value={this.state.keyEncipherment} last changeValue={() => this.setState({ keyEncipherment: !this.state.keyEncipherment })} />
               </> : null}
               <Button style={{ width: "100%", backgroundColor: "white" }} onPress={() => this.setState({ keyAssignment: !this.state.keyAssignment })}>
                  <Text style={{ color: "grey" }}>Назначение сертификата</Text>
                  {this.state.keyAssignment ? <Icon style={{ color: "grey", position: "absolute", right: "5%" }} name="ios-arrow-down" /> :
                     <Icon style={{ color: "grey", position: "absolute", right: "5%" }} name="ios-arrow-up" />}
               </Button>
               {!this.state.keyAssignment ? <>
                  <ListWithSwitch text="Проверка подлинности сервера" value={this.state.server_auth} changeValue={() => this.setState({ server_auth: !this.state.server_auth })} />
                  <ListWithSwitch text="Проверка подлинности клиента" value={this.state.client_auth} changeValue={() => this.setState({ client_auth: !this.state.client_auth })} />
                  <ListWithSwitch text="Подпись кода" value={this.state.code_sign} changeValue={() => this.setState({ code_sign: !this.state.code_sign })} />
                  <ListWithSwitch text="Защита элкетронной почты" value={this.state.email_protection} last changeValue={() => this.setState({ email_protection: !this.state.email_protection })} />
               </> : null}
            </Content>
            <Footer>
               <FooterTab style={{ borderColor: "#be3817", borderWidth: 4 }}>
                  <Button vertical onPress={this.onPressCertRequest} >
                     <Text style={{ color: "black" }}>Создать</Text>
                  </Button>
               </FooterTab>
            </Footer>
         </Container>
      );
   }
}