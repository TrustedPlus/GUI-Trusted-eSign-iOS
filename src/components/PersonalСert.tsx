import * as React from "react";
import { Container, List, Content } from "native-base";
import { Headers } from "./Headers";
import ListMenu from "./ListMenu";
import { styles } from "../styles";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { readCertKeys } from "../actions/CertKeysAction";
import { PropertiesCert } from "./PropertiesCert";

interface PersonalСertProps {
   navigation: any;
   pesronalCertKeys: any;
   readCertKeys(): any;
}

class PersonalСert extends React.Component<PersonalСertProps> {

   static navigationOptions = {
      header: null
   };

   ShowList(img) {
      return (
         this.props.pesronalCertKeys.map((cert, key) => (cert.category.toUpperCase() === "MY") ? <ListMenu
            key={key}
            title={cert.subjectFriendlyName}
            note={cert.organizationName}
            img={img[key]}
            issuerName={cert.issuerName}
            serialNumber={cert.serialNumber}
            rightimg={cert.hasPrivateKey ? require("../../imgs/general/key_icon.png") : null}
            nav={() => this.props.navigation.navigate("PropertiesCert", { cert: cert })} /> : null));
   }

   render() {
      const { pesronalCertKeys } = this.props;
      const { goBack } = this.props.navigation;

      let img = [];
      for (let i = 0; i < pesronalCertKeys.length; i++) { // какое расширение у файлов
         switch (pesronalCertKeys[i].extension) {
            default:
               img[i] = require("../../imgs/general/cert2_ok_icon.png"); break;
         }
      }

      return (
         <Container style={styles.container}>
            <Headers title="Личные сертификаты" goBack={() => goBack()} />
            <Content>
               <List>
                  {this.ShowList(img)}
               </List>
            </Content>
         </Container>
      );
   }

   componentDidMount() {
      this.props.readCertKeys();
   }
}

function mapStateToProps(state) {
   return {
      pesronalCertKeys: state.certKeys.pesronalCertKeys
   };
}

function mapDispatchToProps(dispatch) {
   return {
      readCertKeys: bindActionCreators(readCertKeys, dispatch)
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonalСert);