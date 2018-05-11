import * as React from "react";
import { Container, Item, Label, Input, Footer, FooterTab, Button, List, ListItem, Text, Content, Icon, Right, Body, Form } from "native-base";
import { Headers } from "./Headers";
import { styles } from "../styles";
import { View, Switch, Alert, AlertIOS } from "react-native";
import * as RNFS from "react-native-fs";
import { Dropdown } from "react-native-material-dropdown";
import { genSelfSignedCertWithoutRequest } from "../utils/createCert";
import { readCertKeys } from "../actions/CertKeysAction";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

function mapDispatchToProps(dispatch) {
   return {
       readCertKeys: bindActionCreators(readCertKeys, dispatch)
   };
}

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
   options: any;
}

class ListWithModalDropdown extends React.Component<ListWithModalDropdownProps> {

   render() {
      return (
         <List>
            <Dropdown
               onChangeText={this.props.changeValue}
               value={this.props.defaultValue}
               label={this.props.text}
               data={this.props.options} />
         </List>
      );
   }
}

interface CreateCertificateState {
   algorithm: any;
   keyLength: number;
   keyAssignment: number;
   certAssignment: boolean;
   server_auth: boolean;
   client_auth: boolean;
   code_sign: boolean;
   email_protection: boolean;
   cert_template: number;
   CN: string;
   email: string;
   org: string;
   city: string;
   obl: string;
   country: string;
   errorInputCN: boolean;
   errorInputCountry: boolean;
}

interface CreateCertificateProps {
   navigation: any;
   readCertKeys(): void;
}

@(connect(null, mapDispatchToProps) as any)
export class CreateCertificate extends React.Component<CreateCertificateProps, CreateCertificateState> {

   static navigationOptions = {
      header: null
   };

   constructor(props) {
      super(props);
      this.state = {
         algorithm: "GOST P 34.10-2012 256 bit",
         keyLength: 512,
         keyAssignment: 0,
         certAssignment: true,
         server_auth: false,
         client_auth: true,
         code_sign: false,
         email_protection: true,
         cert_template: 0,
         CN: "",
         email: "",
         org: "",
         city: "",
         obl: "",
         country: "RU",
         errorInputCN: false,
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
      if (this.state.CN !== "") {
         genSelfSignedCertWithoutRequest(
            this.state.algorithm,
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
            this.state.country
         ).then(() => {
            setTimeout(() => {
               AlertIOS.alert(
                  "Сертификат и ключ создан",
                  null,
                  [
                     { text: "Ок", onPress: () => {this.props.readCertKeys(); this.props.navigation.goBack(); }},
                  ]
               );
            }, 500);
         }).catch(err => {
            Alert.alert(err + "");
         });
      } else {
         this.state.CN === "" ? this.setState({ errorInputCN: true }) : null;
         Alert.alert("Заполните поле CN");
      }
   }

   render() {
      const { navigate, goBack } = this.props.navigation;
      return (
         <Container style={styles.container}>
            <Headers title="Создание сертификата" goBack={() => goBack()} />
            <Content>
               <View style={{ padding: 10 }}>
                  <ListWithModalDropdown text="Алгоритм"
                     defaultValue="GOST P 34.10-2012 256 bit"
                     changeValue={(value) => this.setState({ algorithm: value })}
                     options={[{ value: "GOST P 34.10-2001" }, { value: "GOST P 34.10-2012 256 bit" }, { value: "GOST P 34.10-2012 512 bit" }]} />
                  {this.state.algorithm === "RSA" ? <> <ListWithModalDropdown text="Длина ключа"
                     defaultValue="512"
                     changeValue={(value) => this.setState({ keyLength: Number(value) })}
                     options={[{ value: "512" }, { value: "1024" }, { value: "2048" }, { value: "3072" }, { value: "4096" }]} />
                     <ListWithModalDropdown text="Назначение ключа"
                        defaultValue="Подпись и шифрование"
                        changeValue={(value, index) => this.setState({ keyAssignment: Number(index) })}
                        options={[{ value: "Подпись и шифрование" }, { value: "Шифрование" }, { value: "Подпись" }]} />
                  </> : <ListWithModalDropdown text="Шаблон сертификата"
                     defaultValue="Cертификат пользователя УЦ"
                     changeValue={(value, index) => this.setState({ cert_template: Number(index) })}
                     options={[{ value: "Cертификат пользователя УЦ" },
                     { value: "One day User" }, { value: "Временный сертификат Оператора УЦ" },
                     { value: "Временный сертификат пользователя УЦ" }, { value: "Сертификат ipsec" },
                     { value: "Сертификат Администратора для DSS" }, { value: "Сертификат аудитора журнала УЦ" },
                     { value: "Сертификат входа в домен по УЭК" }, { value: "Сертификат входа со смарт-картой" },
                     { value: "Сертификат контроллера домена (winlogon)" }, { value: "Сертификат оператора службы OCSP" },
                     { value: "Сертификат оператора службы штампов времени" }, { value: "Сертификат Оператора УЦ" },
                     { value: "Сертификат подписи (тест УЭК)" }, { value: "Сертификат подписи с лицензией (тест УЭК)" },
                     { value: "Сертификат пользователя DSS" }, { value: "Сертификат сервера" },
                     { value: "Совсем временный сертификат" }]} />}
               </View>
               <View style={styles.sign_enc_view}>
                  <Text style={{ color: "grey" }}>Параметры субъекта</Text>
               </View>
               <Form>
                  <Item floatingLabel error={this.state.errorInputCN ? true : false} >
                     <Label>CN</Label>
                     <Input onChangeText={(CN) => this.setState({ CN })} />
                  </Item>
                  <Item floatingLabel>
                     <Label>email</Label>
                     <Input onChangeText={(email) => this.setState({ email })} />
                  </Item>
                  <Item floatingLabel>
                     <Label>организация</Label>
                     <Input onChangeText={(org) => this.setState({ org })} />
                  </Item>
                  <Item floatingLabel>
                     <Label>город</Label>
                     <Input onChangeText={(city) => this.setState({ city })} />
                  </Item>
                  <Item floatingLabel>
                     <Label>область</Label>
                     <Input onChangeText={(obl) => this.setState({ obl })} />
                  </Item>
               </Form>
               <View style={{ paddingLeft: 15 }}>
                  <ListWithModalDropdown text="страна"
                     defaultValue="RU"
                     changeValue={(value) => this.setState({ country: value })}
                     options={[{ value: "RU" }, { value: "GER" }]} />
               </View>
               <Button style={{ width: "100%", backgroundColor: "white" }} onPress={() => this.setState({ certAssignment: !this.state.certAssignment })}>
                  <Text style={{ color: "grey" }}>Назначение сертификата</Text>
                  {this.state.certAssignment ? <Icon style={{ color: "grey", position: "absolute", right: "5%" }} name="ios-arrow-down" /> :
                     <Icon style={{ color: "grey", position: "absolute", right: "5%" }} name="ios-arrow-up" />}
               </Button>
               {!this.state.certAssignment ? <>
                  <ListWithSwitch text="Проверка подлинности сервера" value={this.state.server_auth} changeValue={() => this.setState({ server_auth: !this.state.server_auth })} />
                  <ListWithSwitch text="Проверка подлинности клиента" value={this.state.client_auth} changeValue={() => this.setState({ client_auth: !this.state.client_auth })} />
                  <ListWithSwitch text="Подпись кода" value={this.state.code_sign} changeValue={() => this.setState({ code_sign: !this.state.code_sign })} />
                  <ListWithSwitch text="Защита элкетронной почты" value={this.state.email_protection} last changeValue={() => this.setState({ email_protection: !this.state.email_protection })} />
               </> : null}
            </Content>
            <Footer>
               <FooterTab style={{ backgroundColor: "#F8F8F8", borderRadius: 0, borderColor: "#cbcbcb", borderTopWidth: 0.25 }}>
                  <Button vertical onPress={this.onPressCertRequest} >
                     <Text style={{ color: "black" }}>Создать</Text>
                  </Button>
               </FooterTab>
            </Footer>
         </Container>
      );
   }
}