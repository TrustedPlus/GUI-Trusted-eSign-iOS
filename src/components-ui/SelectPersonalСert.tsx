import * as React from "react";
import { Container, Header, Item, Input, List, Content, Button, Icon, Text } from "native-base";
import { Image, AlertIOS } from "react-native";
import { Headers } from "../components/Headers";
import { ListCert } from "../components/ListCert";
import { styles } from "../styles";
import { addCert } from "../actions/index";
import { AddCertButton } from "../components/AddCertButton";

import { personalCertAdd } from "../actions/index";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

function mapStateToProps(state) {
   return {
      pesronalCertKeys: state.certKeys.pesronalCertKeys
   };
}

function mapDispatchToProps(dispatch) {
   return {
      addCert: bindActionCreators(addCert, dispatch),
      personalCertAdd: bindActionCreators(personalCertAdd, dispatch)
   };
}

interface SelectPersonalСertProps {
   navigation: any;
   pesronalCertKeys: any;
   addCert(uri: string, fileName: string, password: string): Function;
   personalCertAdd?(title: string, img: string, note: string, issuerName: string, serialNumber: string, provider: string, category: string): void;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class SelectPersonalСert extends React.Component<SelectPersonalСertProps> {

   static navigationOptions = {
      header: null
   };

   ShowList(img) {
      return (
         this.props.pesronalCertKeys.map((cert, key) => ((cert.category.toUpperCase() === "MY") && (cert.hasPrivateKey)) ? <ListCert
            key={key}
            title={cert.subjectFriendlyName}
            note={cert.organizationName}
            img={img[key]}
            navigate={(page, cert1) => {this.props.navigation.navigate(page, {cert: cert1 }); }}
            goBack={() => {this.props.personalCertAdd(cert.subjectFriendlyName, img[key], cert.organizationName, cert.issuerName, cert.serialNumber, cert.provider, cert.category); this.props.navigation.goBack(); }}
            cert = {cert}
            arrow/> : null));
   }

   render() {
      const { pesronalCertKeys, addCert } = this.props;
      const { navigate, goBack } = this.props.navigation;
      let img = [];
      for (let i = 0; i < pesronalCertKeys.length; i++) { // какое расширение у файлов
         switch (pesronalCertKeys[i].extension) {
            default:
               img[i] = require("../../imgs/general/cert2_ok_icon.png"); break;
         }
      }
      return (
         <Container style={styles.container}>
            <Headers title="Выберите сертификат" goBack={() => goBack()} />
            <Content>
               <List>
                  {this.ShowList(img)}
               </List>
            </Content>
            <AddCertButton navigate={(page) => navigate(page)} addCertFunc={(uri, fileName, password) => this.props.addCert(uri, fileName, password)} />
         </Container>
      );
   }
}