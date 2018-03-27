import * as React from 'react';
import { Platform, StyleSheet, Text, Button, View, ScrollView } from 'react-native';
import {NativeModules} from "react-native";

var number = 7;

export default class App extends React.Component<{}> {
    constructor(props) {
        super(props);
        this.state = ({
            errorLabel: "",               //описание ошибки
            certsLabel: "",               //список загруженных сертификатов из всех хранилищ
            resultLabel: "",              //результат выполнения функции 
            countCryptoCertsInStore: "",  //количество сертификатов в хранилище crypto
            errorCSPLabel: "",            //описание ошибки CSP
            resultCSPLabel: "",           //результат выполнения функции CSP
            countCSPCertsInStore: "",     //количество сертификатов в хранилище CSP
            
            saveCertToStoreLabel: "",
            saveKeyToStoreLabel: "",
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
            getOrganizationNameLabel: "",            
            hasPrivateKey: "",
            
            providerListCSPLabel: "",
            containerListCSPLabel: ""
        });
        this.onPressUpdate = this.onPressUpdate.bind(this);

        this.onPressLoad = this.onPressLoad.bind(this);
        this.onPressSaveCertToStore = this.onPressSaveCertToStore.bind(this);
        this.onPressDeleteCertInStore =this.onPressDeleteCertInStore.bind(this);
        this.onPressSaveKeyToStore = this.onPressSaveKeyToStore.bind(this);
        this.onPressSave = this.onPressSave.bind(this);
        this.onPressShowCert = this.onPressShowCert.bind(this);
        this.onPressSignFile = this.onPressSignFile.bind(this);
        this.onPressVerify = this.onPressVerify.bind(this);
        this.onPressEncrypt = this.onPressEncrypt.bind(this);
        this.onPressDecrypt = this.onPressDecrypt.bind(this);
        this.onPressEncryptA = this.onPressEncryptA.bind(this);
        this.onPressDecryptA = this.onPressDecryptA.bind(this);
        this.onPressImportPKCS12 = this.onPressImportPKCS12.bind(this);
        this.onPressExportPKCS12 = this.onPressExportPKCS12.bind(this);
        this.onPressLoadCRL = this.onPressLoadCRL.bind(this);
        this.onPressVerifyChain = this.onPressVerifyChain.bind(this);

        this.onPressCSP_signFile = this.onPressCSP_signFile.bind(this);
        this.onPressCSP_verifySign = this.onPressCSP_verifySign.bind(this);
        this.onPressCSP_encryptFile = this.onPressCSP_encryptFile.bind(this);
        this.onPressCSP_decryptFile = this.onPressCSP_decryptFile.bind(this);
        this.onPressCSP_importPFX = this.onPressCSP_importPFX.bind(this);
        this.onPressCSP_exportPFX = this.onPressCSP_exportPFX.bind(this);
        this.onPressCSP_addCert = this.onPressCSP_addCert.bind(this);
        this.onPressCSP_deleteCertInStore = this.onPressCSP_deleteCertInStore.bind(this);
        this.onPressCSP_enumProviders= this.onPressCSP_enumProviders.bind(this);
        this.onPressCSP_enumContainers = this.onPressCSP_enumContainers.bind(this);
        this.onPressCSP_deleteContainer = this.onPressCSP_deleteContainer.bind(this);
        this.onPressCSp_getContainerNameByCertificate = this.onPressCSp_getContainerNameByCertificate.bind(this);

        this.onPressCSp_attachSignFileNew = this.onPressCSp_attachSignFileNew.bind(this);
        this.onPressCSp_verifyAttachSignFileNew = this.onPressCSp_verifyAttachSignFileNew.bind(this);
    }
    //загрузка из хранилища(crypto and cryptoPro) всех сертификатов
    componentDidMount() {
      //задает путь к хранилищу crypto
      NativeModules.CertsList.pathToStore(
        "/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/store",
        (err, label) => {
        this.setState({errorLabel: err, resultLabel: label});
      });
      //инициализация провайдера
      NativeModules.CertsList.providerInit(
        (err, label) => {
        this.setState({errorLabel: err, resultLabel: label});
      });
      //загрузка из хранилища(crypto and cryptoPro) всех сертификатов
      NativeModules.CertsList.showCerts(
        (err, label) => {
        this.setState({errorLabel: err, certsLabel: label});
      });
      //запись в countCryptoCertsInStore количества сертификатов из хранилища crypto
      NativeModules.CertsList.getCountsOfCertsInCryptoStore(
        (count) => {
        this.setState({countCryptoCertsInStore: count});
      });
      //запись в countCSPCertsInStore количества сертификатов из хранилища cryptoPro
      NativeModules.CertsList.getCountsOfCertsInCryptoCSPStore(
        (count) => {
        this.setState({countCSPCertsInStore: count});
      });
    }
    //перезагрузка из хранилища(crypto and cryptoPro) всех сертификатов
    onPressUpdate(){
      NativeModules.CertsList.showCerts(
        (err, label) => {
        this.setState({errorLabel: err, certsLabel: label});
      });
      //запись в countCryptoCertsInStore количества сертификатов из хранилища crypto
      NativeModules.CertsList.getCountsOfCertsInCryptoStore(
        (count) => {
        this.setState({countCryptoCertsInStore: count});
      });
      //запись в countCSPCertsInStore количества сертификатов из хранилища cryptoPro
      NativeModules.CertsList.getCountsOfCertsInCryptoCSPStore(
        (count) => {
        this.setState({countCSPCertsInStore: count});
      });
    }
/*
 *  CRYPTO    
*/
    //загрузка из хранилища
    onPressLoad(){
      NativeModules.WCert.Load(
        this.state.certsLabel[number]["serialNumber"],
        (err, load) => {
        this.setState({errorLabel: err, resultLabel: load, hasPrivateKey: this.state.certsLabel[number]["hasPrivateKey"]}, function() {console.log("State", this.state); });
      });
    }
    //запись сертификата в хранилище crypto
    onPressSaveCertToStore(){
      NativeModules.WCert.saveCertToStore(
        "/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/cert\ and\ key/rsa_notkey.cer", 
        "BASE64", 
        "MY", 
        (err, saveCert) => {
        this.setState({errorLabel: err, resultLabel: saveCert}, function() {console.log("State", this.state); });
      });
    }
    //удаление сертификата из хранилище crypto
    onPressDeleteCertInStore(){
      NativeModules.WCert.deleteCertInStore(
        this.state.certsLabel[number]["serialNumber"],
        (err, deleteCert) => {
        this.setState({errorLabel: err, resultLabel: deleteCert}, function() {console.log("State", this.state); });
      });
    }
    //запись ключа в хранилище crypto
    onPressSaveKeyToStore(){
      NativeModules.WCert.saveKeyToStore(
        "/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/cert\ and\ key/cert1.key", 
        "BASE64", 
        "", 
        (err, saveKey) => {
        this.setState({errorLabel: err, resultLabel: saveKey}, function() {console.log("State", this.state); });
      });
    }
    //сохранение сертификата в файл, загруженного в память при использовании функции Load
    onPressSave(){
      NativeModules.WCert.Save("/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/cert\ and\ key/RsaCert.cer", "BASE64", (err, save) => {
        this.setState({errorLabel: err, resultLabel: save}, function() {console.log("State", this.state); });
      });
    }
    //показать содержимое сертификата, загруженного в память при использовании функции Load
    onPressShowCert(){
      NativeModules.WCert.getVersion(
        (err, name) => {
        this.setState({errorLabel: err, getVersionLabel: name}, function() {console.log("State", this.state); });
      });
      NativeModules.WCert.getSerialNumber(
        (err, name) => {
        this.setState({errorLabel: err, getSerialNumberLabel: name}, function() {console.log("State", this.state); });
      });
      NativeModules.WCert.getNotBefore(
        (err, name) => {
        this.setState({errorLabel: err, getNotBeforeLabel: name}, function() {console.log("State", this.state); });
      });
      NativeModules.WCert.getNotAfter(
        (err, name) => {
        this.setState({errorLabel: err, getNotAfterLabel: name}, function() {console.log("State", this.state); });
      });
      NativeModules.WCert.getIssuerFriendlyName(
        (err, name) => {
        this.setState({errorLabel: err, getIssuerFriendlyNameLabel: name}, function() {console.log("State", this.state); });
      });
      NativeModules.WCert.getIssuerName(
        (err, name) => {
        this.setState({errorLabel: err, getIssuerNameLabel: name}, function() {console.log("State", this.state); });
      });
      NativeModules.WCert.getSubjectFriendlyName(
        (err, name) => {
        this.setState({errorLabel: err, getSubjectFriendlyNameLabel: name}, function() {console.log("State", this.state); });
      });
      NativeModules.WCert.getSubjectName(
        (err, name) => {
        this.setState({errorLabel: err, getSubjectNameLabel: name}, function() {console.log("State", this.state); });
      });
      NativeModules.WCert.getPublicKeyAlgorithm(
        (err, name) => {
        this.setState({errorLabel: err, getPublicKeyAlgorithmLabel: name}, function() {console.log("State", this.state); });
      });
      NativeModules.WCert.getSignatureAlgorithm(
        (err, name) => {
        this.setState({errorLabel: err, getSignatureAlgorithLabel: name}, function() {console.log("State", this.state); });
      });
      NativeModules.WCert.getSignatureDigestAlgorithm(
        (err, name) => {
        this.setState({errorLabel: err, getSignatureDigestAlgorithmLabel: name}, function() {console.log("State", this.state); });
      });
      NativeModules.WCert.getOrganizationName(
        (err, name) => {
        this.setState({errorLabel: err, getOrganizationNameLabel: name}, function() {console.log("State", this.state); });
      });
      NativeModules.WCert.getThumbprint(
        (err, name) => {
        this.setState({errorLabel: err, getThumbprintLabel: name}, function() {console.log("State", this.state); });
      });
    }
    //подпись файла
    onPressSignFile() {
      NativeModules.WSigner.signFile(
        this.state.certsLabel[number]["serialNumber"],
        "/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/cert\ and\ key/input.txt", 
        "/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/cert\ and\ key/output.txt", 
        (err, signFile) => {
        this.setState({errorLabel: err, resultLabel: signFile}, function() {console.log("State", this.state); });
      });
    }
    //проверка подписи
    onPressVerify() {
      NativeModules.WSigner.verifySign(
        this.state.certsLabel[number]["serialNumber"],
        "/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/cert\ and\ key/output.txt", 
        (err, verify) => {
        this.setState({errorLabel: err, resultLabel: verify}, function() {console.log("State", this.state); });
      });
    }
    //симметричное шифрование файла
    onPressEncrypt() {
      NativeModules.WCipher.EncSymmetric(
        "/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/encrypt/input.txt", 
        "/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/encrypt/encrypt.txt", 
        (err, encrypt) => {
        this.setState({errorLabel: err, resultLabel: encrypt}, function() {console.log("State", this.state); });
      });
    }
    //симметричное дешифрование файла
    onPressDecrypt() {
      NativeModules.WCipher.DecSymmetric(
        "/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/encrypt/encrypt.txt", 
        "/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/encrypt/output.txt", 
        (err, decrypt) => {
        this.setState({errorLabel: err, resultLabel: decrypt}, function() {console.log("State", this.state); });
      });
    }
    //асимметричное шифрование файла
    onPressEncryptA() {
      NativeModules.WCipher.EncAssymmetric(
        this.state.certsLabel[number]["serialNumber"],
        "/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/encrypt/input.txt", 
        "/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/encrypt/encrypt.txt", 
        (err, encrypt) => {
        this.setState({errorLabel: err, resultLabel: encrypt}, function() {console.log("State", this.state); });
      });
    }
    //асимметричное дешифрование файла
    onPressDecryptA() {
      NativeModules.WCipher.DecAssymmetric(
        this.state.certsLabel[number]["serialNumber"],
        "/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/encrypt/encrypt.txt", 
        "/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/encrypt/output.txt", 
        (err, decrypt) => {
        this.setState({errorLabel: err, resultLabel: decrypt}, function() {console.log("State", this.state); });
      });
    }
    //импорт PKCS12 из файла
    onPressImportPKCS12(){
      NativeModules.WPkcs12.ImportPKCS12(
        "/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/cert\ and\ key/p12.pfx",
        "",
        "",
        (err, imp) => { 
          this.setState({errorLabel: err, resultLabel: imp}, function() {console.log("State", this.state); });
      });
    }
    //экспорт PKCS12 в файл
    onPressExportPKCS12(){
      NativeModules.WPkcs12.ExportPKCS12(
        this.state.certsLabel[number]["serialNumber"],
        "12345678",
        "name",
        "/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/cert\ and\ key/export_pfx.pfx",
        (err, exp) => { 
          this.setState({errorLabel: err, resultLabel: exp}, function() {console.log("State", this.state); });
      });
    }
    //загрузка файла отзыва сертификатов в хранилище crypto
    onPressLoadCRL(){
      NativeModules.WCrl.saveCRLToStore(
        "/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/cert\ and\ key/test.crl", 
        "DER",
        (err, saveCert) => {
        this.setState({errorLabel: err, resultLabel: saveCert}, function() {console.log("State", this.state); });
      });
    }
    //проверка сертификата на отзыв
    onPressVerifyChain(){
      NativeModules.WCrl.verifyChain(
        this.state.certsLabel[number]["serialNumber"],
        (err, saveCert) => {
        this.setState({errorLabel: err, resultLabel: saveCert}, function() {console.log("State", this.state); });
      });
    }
/*
 *  CRYPTOPRO CSP    
*/
    //подпись файла
    onPressCSP_signFile() {
      NativeModules.PSigner.signFile(
        this.state.certsLabel[number]["serialNumber"],
        this.state.certsLabel[number]["category"],
        "/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/CSP_sign/input.txt",
        "/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/CSP_sign/input.sig.txt", 
        (err, label) => {
        this.setState({errorCSPLabel: err, resultCSPLabel: label}, function() {console.log("State", this.state); });
      });
    }
    //проверка подписи
    onPressCSP_verifySign() {
      NativeModules.PSigner.verifySign(
        "/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/CSP_sign/input.txt",
        "/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/CSP_sign/input.sig.txt", 
        (err, label) => {
        this.setState({errorCSPLabel: err, resultCSPLabel: label}, function() {console.log("State", this.state); });
      });
    }
    //шифрование файла
    onPressCSP_encryptFile() {
      NativeModules.PCipher.encFile(
        this.state.certsLabel[number]["serialNumber"],
        this.state.certsLabel[number]["category"],
        "/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/CSP_encrypt/input.txt",
        "/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/CSP_encrypt/enc.txt",
        (err, label) => {
        this.setState({errorCSPLabel: err, resultCSPLabel: label}, function() {console.log("State", this.state); });
      });
    }
    //дешифрование файла
    onPressCSP_decryptFile() {
      NativeModules.PCipher.decFile(
        this.state.certsLabel[number]["serialNumber"],
        this.state.certsLabel[number]["category"],
        "/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/CSP_encrypt/enc.txt",
        "/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/CSP_encrypt/dec.txt",
        (err, label) => {
        this.setState({errorCSPLabel: err, resultCSPLabel: label}, function() {console.log("State", this.state); });
      });
    }
    //импорт PFX - добавление сертификата и ключа в хранилище КриптоПРО (в PFX - ОДИН сертификат и ОДИН ключ)
    onPressCSP_importPFX() {
      NativeModules.PCerts.importPFX(
        "/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/cert\ and\ key/GOST_cryptoARM.pfx", 
        "12345678", 
        (err, label) => {
        this.setState({errorCSPLabel: err, resultCSPLabel: label}, function() {console.log("State", this.state); });
      });
    }
    //экспорт PFX - эскопртирование сертификата и ключа из хранилище КриптоПРО
    onPressCSP_exportPFX() {
      NativeModules.PCerts.exportPFX(
        this.state.certsLabel[number]["serialNumber"],
        this.state.certsLabel[number]["category"],
        "true",
        "12345678",
        "/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/cert\ and\ key/GOST_CSP_pfx.pfx", 
        (err, label) => {
        this.setState({errorCSPLabel: err, resultCSPLabel: label}, function() {console.log("State", this.state); });
      });
    }
    //добавление сертификата в хранилище криптоПРО
    onPressCSP_addCert() {
      NativeModules.PCert.addCert(
        "/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/cert\ and\ key/gost_onlyCert.cer",
        "BASE64",
        "My", 
        (err, label) => {
        this.setState({errorCSPLabel: err, resultCSPLabel: label}, function() {console.log("State", this.state); });
      });
    }
    //удаление сертификата под номером number из хранилища КриптоПро, если он найден
    onPressCSP_deleteCertInStore(){
      NativeModules.PCert.deleteCertInStore(
        this.state.certsLabel[number]["serialNumber"],
        this.state.certsLabel[number]["category"],
        (err, label) => {
        this.setState({errorCSPLabel: err, resultCSPLabel: label}, function() {console.log("State", this.state); });
      });
    }
    //возвращает массив криптопровайдеров cryptoPro CSP 
    onPressCSP_enumProviders() {
      NativeModules.PCsp.enumProviders(
        (err, label) => {
        this.setState({errorCSPLabel: err, providerListCSPLabel: label}, function() {console.log("State", this.state); });
      });
    }
    //возвращает массив контейнеров созданных на основе входного криптопровайдера
    onPressCSP_enumContainers() { 
      NativeModules.PCsp.enumContainers(
        this.state.providerListCSPLabel[2]["type"],
        this.state.providerListCSPLabel[2]["provider"],
        (err, label) => {
        this.setState({errorCSPLabel: err, containerListCSPLabel: label}, function() {console.log("State", this.state); });
      });
    }
    //удаление контейнера из хранилища cryptoPro CSP
    onPressCSP_deleteContainer(){
      NativeModules.PCsp.deleteContainer(
        this.state.containerListCSPLabel[0]["unique"],//"HDIMAGE\\\\de2f8166.000\\5BCD",
        this.state.providerListCSPLabel[0]["type"],//"75", 
        this.state.providerListCSPLabel[0]["provider"],//"Crypto-Pro GOST R 34.10-2012 KC1 CSP", 
        (err, label) => {
        this.setState({errorCSPLabel: err, resultCSPLabel: label}, function() {console.log("State", this.state); });
      });
    }
    //получение имени контейнера по сертификату
    onPressCSp_getContainerNameByCertificate(){
      NativeModules.PCsp.getContainerNameByCertificate(
        this.state.certsLabel[number]["serialNumber"],
        this.state.certsLabel[number]["category"],
        (err, label) => {
        this.setState({errorCSPLabel: err, resultCSPLabel: label}, function() {console.log("State", this.state); });
      });
    }
    //подпись файла
    onPressCSp_attachSignFileNew(){
      NativeModules.PSigner.attachSignFile(
        this.state.certsLabel[number]["serialNumber"],
        this.state.certsLabel[number]["category"],
        "/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/CSP_sign/input_attach.txt",
        "/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/CSP_sign/input_attach.sig.txt", 
        (err, label) => {
        this.setState({errorCSPLabel: err, resultCSPLabel: label}, function() {console.log("State", this.state); });
      });
    }
    //проверка подписи
    onPressCSp_verifyAttachSignFileNew(){
      NativeModules.PSigner.verifyAttachSignFile(
        this.state.certsLabel[number]["serialNumber"],
        this.state.certsLabel[number]["category"],        
        "/Users/admin/Documents/GitHub/GUI-Trusted-eSign-iOS/ios/tests/CSP_sign/input_attach.sig.txt", 
        (err, label) => {
        this.setState({errorCSPLabel: err, resultCSPLabel: label}, function() {console.log("State", this.state); });
      });
    }

    getText(){
      if (this.state.certsLabel[number]){
        return <Text style={styles.instructions}> show all certs: { this.state.certsLabel[number]["issuerName"] } </Text> 
      }
      else {
        <Text style={styles.instructions}> show all certs: } </Text> 
      }
    }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.welcome}> Crypto module. </Text>
        <Text style={styles.instructions}> error:  {this.state.errorLabel} </Text>
        <Text style={styles.instructions}> result:  {this.state.resultLabel} </Text>
        <Text style={styles.instructions}> countCryptoCertsInStore:  {this.state.countCryptoCertsInStore} </Text>
        <Text style={styles.instructions}> countCSPCertsInStore:  {this.state.countCSPCertsInStore} </Text>
        <Button onPress={this.onPressUpdate} title="update" color="green"/>
        <Button onPress={this.onPressSaveCertToStore} title="saveCertToStore" color="green"/>
        <Button onPress={this.onPressDeleteCertInStore} title="deleteCertToStore" color="green"/>
        <Button onPress={this.onPressSaveKeyToStore} title="saveKeyToStore" color="green"/>

        <Button onPress={this.onPressLoad} title="Load" color="green"/>
        <Button onPress={this.onPressSave} title="Save" color="green"/>
        <Button onPress={this.onPressLoadCRL} title="LoadCRL" color="green"/>
        <Button onPress={this.onPressVerifyChain} title="VerifyChain" color="green"/>
        <Button onPress={this.onPressSignFile} title="sign file" color="#841584"/>
        <Button onPress={this.onPressVerify} title="verify" color="#841584"/>
        <Button onPress={this.onPressEncrypt} title="encrypt" color="#841584"/>
        <Button onPress={this.onPressDecrypt} title="decrypt" color="#841584"/>
        <Button onPress={this.onPressEncryptA} title="encrypt assymmetric" color="#841584"/>
        <Button onPress={this.onPressDecryptA} title="decrypt assymmetric" color="#841584"/>
        <Button onPress={this.onPressImportPKCS12} title="importPKCS12" color="green"/>
        <Button onPress={this.onPressExportPKCS12} title="exportPKCS12" color="green"/>
        <Button onPress={this.onPressShowCert} title="ShowCert" color="green"/>
        <Text style={styles.instructions}> getVersionLabel:  {this.state.getVersionLabel} </Text>
        <Text style={styles.instructions}> getSerialNumberLabel: {this.state.getSerialNumberLabel} </Text>
        <Text style={styles.instructions}> getNotBeforeLabel: {this.state.getNotBeforeLabel} </Text>
        <Text style={styles.instructions}> getNotAfterLabel: {this.state.getNotAfterLabel} </Text>
        <Text style={styles.instructions}> getIssuerFriendlyNameLabel: {this.state.getIssuerFriendlyNameLabel} </Text>
        <Text style={styles.instructions}> getIssuerNameLabel: {this.state.getIssuerNameLabel} </Text>
        <Text style={styles.instructions}> getSubjectFriendlyNameLabel: {this.state.getSubjectFriendlyNameLabel} </Text>
        <Text style={styles.instructions}> getSubjectNameLabel: {this.state.getSubjectNameLabel} </Text>
        <Text style={styles.instructions}> getThumbprintLabel: {this.state.getThumbprintLabel} </Text>
        <Text style={styles.instructions}> getPublicKeyAlgorithmLabel: {this.state.getPublicKeyAlgorithmLabel} </Text>
        <Text style={styles.instructions}> getSignatureAlgorithLabel: {this.state.getSignatureAlgorithLabel} </Text>
        <Text style={styles.instructions}> getSignatureDigestAlgorithmLabel: {this.state.getSignatureDigestAlgorithmLabel} </Text>
        <Text style={styles.instructions}> getOrganizationNameLabel: {this.state.getOrganizationNameLabel} </Text>
        <Text style={styles.instructions}> hasPrivateKey: {this.state.hasPrivateKey} </Text>

        <Text style={styles.welcome}> CryptoPro framework </Text>
        <Text style={styles.instructions}> error:  {this.state.errorCSPLabel} </Text>
        <Text style={styles.instructions}> result:  {this.state.resultCSPLabel} </Text>
        {this.getText()}
        <Button onPress={this.onPressCSP_signFile} title="sign" color="green"/>
        <Button onPress={this.onPressCSP_verifySign} title="verify" color="green"/>
        <Button onPress={this.onPressCSP_encryptFile} title="encrypt" color="green"/>
        <Button onPress={this.onPressCSP_decryptFile} title="decrypt" color="green"/>
        <Button onPress={this.onPressCSP_importPFX} title="importPFX" color="green"/>
        <Button onPress={this.onPressCSP_exportPFX} title="exportPFX" color="green"/>
        <Button onPress={this.onPressCSP_addCert} title="addCert" color="green"/>
        <Button onPress={this.onPressCSP_deleteCertInStore} title="deleteCertInStore" color="green"/>
        <Button onPress={this.onPressCSP_enumProviders} title="enumProviders" color="green"/>
        <Button onPress={this.onPressCSP_enumContainers} title="enumContainers" color="green"/>
        <Button onPress={this.onPressCSP_deleteContainer} title="deleteContainer" color="green"/>
        <Button onPress={this.onPressCSp_getContainerNameByCertificate} title="getContainerNameByCertificate" color="green"/>

        <Button onPress={this.onPressCSp_attachSignFileNew} title="attachSignFileNew" color="green"/>
        <Button onPress={this.onPressCSp_verifyAttachSignFileNew} title="verifyAttachSignFileNew" color="green"/>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'left',
    margin: 10,
  },
  instructions: {
    textAlign: 'left',
    color: '#333333',
    marginBottom: 5,
  },
  alignLeft: {
    fontSize: 10,
    textAlign: 'left',
    margin: 10,
  },
});