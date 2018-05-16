import * as React from "react";
import { Container, List, Content } from "native-base";
import { Headers } from "../components/Headers";
import { ListCert } from "../components/ListCert";
import { styles } from "../styles";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { AddCertButton } from "../components/AddCertButton";
import { addCert } from "../actions/index";

function mapStateToProps(state) {
   return {
      pesronalCertKeys: state.certKeys.pesronalCertKeys
   };
}

function mapDispatchToProps(dispatch) {
   return {
      addCert: bindActionCreators(addCert, dispatch)
   };
}

interface ListCertCategoryProps {
   navigation: any;
   pesronalCertKeys: any;
   title: string;
   category: string;
   addCert(uri: string, fileName: string, password: string): Function;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class ListCertCategory extends React.Component<ListCertCategoryProps> {

   static navigationOptions = {
      header: null
   };

   ShowList(img) {
      return (
         this.props.pesronalCertKeys.map((cert, key) => (cert.category.toUpperCase() === this.props.navigation.state.params.category[0] || (cert.category.toUpperCase() === this.props.navigation.state.params.category[1])) ?
         <ListCert
            key={key}
            title={cert.subjectFriendlyName}
            note={cert.organizationName}
            img={img[key]}
            navigate={(page, cert1) => {this.props.navigation.navigate(page, {cert: cert1 }); }}
            goBack={() => {this.props.navigation.navigate("PropertiesCert", {cert: cert }); }}
            cert = {cert}
            arrow/> : null));
   }

   render() {
      const { pesronalCertKeys } = this.props;
      const { goBack, navigate } = this.props.navigation;
      let img = [];
      for (let i = 0; i < pesronalCertKeys.length; i++) { // какое расширение у файлов
         switch (pesronalCertKeys[i].extension) {
            default:
               img[i] = require("../../imgs/general/cert2_ok_icon.png"); break;
         }
      }

      return (
         <Container style={styles.container}>
            <Headers title={this.props.navigation.state.params.title} goBack={() => goBack()} />
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