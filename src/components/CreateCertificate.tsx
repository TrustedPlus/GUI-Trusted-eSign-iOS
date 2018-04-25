import * as React from "react";
import { Container, Item, CheckBox, Input, List, ListItem, Header, Title, Text, Content, Icon, Right, Body, Left, Picker, Form, NativeBase } from "native-base";
import { Headers } from "./Headers";
import { styles } from "../styles";
import { View, Slider, Switch, Button, Alert, NativeModules } from "react-native";
import { addCert } from "../actions/index";
import * as RNFS from "react-native-fs";

interface CreateCertificateState {
      algorithm: any;
      value: number;
      dataEncipherment: boolean;
      keyAgreement: boolean;
      keyCertSign: boolean;
      decipherOnly: boolean;
      encipherOnly: boolean;
      digitalSignature: boolean;
      nonRepudiation: boolean;
      cRLSign: boolean;
      keyEncipherment: boolean;
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
}

interface CreateCertificateProps {
      navigation: any;
}

interface CListWithSwitchProps {
      text: string;
      value: boolean;
      changeValue: any;
      last?: boolean;
}

class ListWithSwitch extends React.Component<CListWithSwitchProps> {

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
                                          style={{ marginBottom: 10 }}
                                          value={this.props.value} />
                              </Right>
                        </ListItem>
                  </List>
            );
      }
}

export class CreateCertificate extends React.Component<CreateCertificateProps, CreateCertificateState> {

      static navigationOptions = {
            header: null
      };

      constructor(props) {
            super(props);
            this.state = {
                  algorithm: "key0",
                  value: 1,
                  dataEncipherment: true,
                  keyAgreement: true,
                  keyCertSign: true,
                  decipherOnly: false,
                  encipherOnly: false,
                  digitalSignature: true,
                  nonRepudiation: true,
                  cRLSign: false,
                  keyEncipherment: false,
                  server_auth: false,
                  client_auth: true,
                  code_sign: false,
                  email_protection: true,
                  CN: "",
                  email: "",
                  org: "",
                  city: "",
                  obl: "",
                  country: ""
            };
            this.onPressCertRequest = this.onPressCertRequest.bind(this);
      }

      onValueChange(value: string) {
            this.setState({
                  algorithm: value
            });
      }

      onPressCertRequest() {
            NativeModules.Wrap_CertRequest.genRequestOnCert(
                  "RSA",
                  (() => {
                        switch (this.state.value) {
                              case 1: return 512;
                              case 2: return 1024;
                              case 3: return 2048;
                              case 4: return 3072;
                              case 5: return 4096;
                        }
                  })(),
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
      }

      render() {
            const { navigate, goBack } = this.props.navigation;
            const FixedPicker: any = Picker;
            console.log(this.state);
            return (
                  <Container style={styles.container}>
                        <Headers title="Создание сертификата" goBack={() => goBack()} />
                        <Content>
                              <View style={styles.sign_enc_view}>
                                    <Text style={{ color: "grey" }}>Алгоритм</Text>
                              </View>
                              <Form>
                                    <FixedPicker
                                          renderHeader={backAction =>
                                                <Headers title="Выбор алгоритма" goBack={backAction} />}
                                          mode="dropdown"
                                          iosIcon={<Icon name="ios-arrow-down-outline" />}
                                          style={{ width: undefined }}
                                          selectedValue={this.state.algorithm}
                                          onValueChange={this.onValueChange.bind(this)}>
                                          <Picker.Item label="RSA" value="key0" />
                                          <Picker.Item label="ГОСТ Р 34.10-2001" value="key1" />
                                          <Picker.Item label="ГОСТ Р 34.10-2012 256 бит" value="key2" />
                                          <Picker.Item label="ГОСТ Р 34.10-2012 512 бит" value="key3" />
                                    </FixedPicker>
                              </Form>
                              <View style={styles.sign_enc_view}>
                                    <Text style={{ color: "grey" }}>Длина ключа</Text>
                              </View>
                              <Text style={styles.sign_enc_view}>
                                    {(() => {
                                          switch (this.state.value) {
                                                case 1: return 512;
                                                case 2: return 1024;
                                                case 3: return 2048;
                                                case 4: return 3072;
                                                case 5: return 4096;
                                          }
                                    })()}
                              </Text>
                              <Slider
                                    style={{ marginLeft: 30, width: "50%" }}
                                    step={1}
                                    minimumValue={1}
                                    maximumValue={5}
                                    onValueChange={(value) => this.setState({ value: value })} />

                              <View style={styles.sign_enc_view}>
                                    <Text style={{ color: "grey" }}>Использование ключа</Text>
                              </View>
                              <ListWithSwitch text="Шифрование" value={this.state.dataEncipherment} changeValue={() => this.setState({ dataEncipherment: !this.state.dataEncipherment })} />
                              <ListWithSwitch text="Согласование" value={this.state.keyAgreement} changeValue={() => this.setState({ keyAgreement: !this.state.keyAgreement })} />
                              <ListWithSwitch text="Подпись сертификатов" value={this.state.keyCertSign} changeValue={() => this.setState({ keyCertSign: !this.state.keyCertSign })} />
                              <ListWithSwitch text="Только расшифрование" value={this.state.decipherOnly} changeValue={() => this.setState({ decipherOnly: !this.state.decipherOnly })} />
                              <ListWithSwitch text="Подпись" value={this.state.digitalSignature} changeValue={() => this.setState({ digitalSignature: !this.state.digitalSignature })} />
                              <ListWithSwitch text="Неотрекаемость" value={this.state.nonRepudiation} changeValue={() => this.setState({ nonRepudiation: !this.state.nonRepudiation })} />
                              <ListWithSwitch text="Автономное подписание списка отзывов" value={this.state.cRLSign} changeValue={() => this.setState({ cRLSign: !this.state.cRLSign })} />
                              <ListWithSwitch text="Шифрование ключа" value={this.state.keyEncipherment} last changeValue={() => this.setState({ keyEncipherment: !this.state.keyEncipherment })} />

                              <View style={styles.sign_enc_view}>
                                    <Text style={{ color: "grey" }}>Назначение сертификата</Text>
                              </View>
                              <ListWithSwitch text="Проверка подлинности сервера" value={this.state.server_auth} changeValue={() => this.setState({ server_auth: !this.state.server_auth })} />
                              <ListWithSwitch text="Проверка подлинности клиента" value={this.state.client_auth} changeValue={() => this.setState({ client_auth: !this.state.client_auth })} />
                              <ListWithSwitch text="Подпись кода" value={this.state.code_sign} changeValue={() => this.setState({ code_sign: !this.state.code_sign })} />
                              <ListWithSwitch text="Защита элкетронной почты" value={this.state.email_protection} last changeValue={() => this.setState({ email_protection: !this.state.email_protection })} />

                              <View style={styles.sign_enc_view}>
                                    <Text style={{ color: "grey" }}>Параметры субъекта</Text>
                              </View>
                              <Form>
                                    <Item success={this.state.CN ? true : false} >
                                          <Input onChangeText={(CN) => this.setState({ CN })} placeholder="CN" />
                                    </Item>
                                    <Item success={this.state.email ? true : false}>
                                          <Input onChangeText={(email) => this.setState({ email })} placeholder="Email адрес" />
                                    </Item>
                                    <Item success={this.state.org ? true : false}>
                                          <Input onChangeText={(org) => this.setState({ org })} placeholder="Организация" />
                                    </Item>
                                    <Item success={this.state.city ? true : false}>
                                          <Input onChangeText={(city) => this.setState({ city })} placeholder="Город" />
                                    </Item>
                                    <Item success={this.state.obl ? true : false}>
                                          <Input onChangeText={(obl) => this.setState({ obl })} placeholder="Область" />
                                    </Item>
                                    <Item success={this.state.country ? true : false} last>
                                          <Input onChangeText={(country) => this.setState({ country })} placeholder="Страна" />
                                    </Item>
                              </Form>
                              <Button
                                    onPress={this.onPressCertRequest}
                                    title="Готово"
                                    color="#be3817"
                              />
                        </Content>
                  </Container>
            );
      }
}