import * as React from "react";
import { Container, Content, List } from "native-base";
import { Signature } from "./Signature";
import { Encryption } from "./Encryption";
import { Certificate } from "./Certificate";
import { Journal } from "./Journal";
import { styles } from "../styles";
import { StackNavigator } from "react-navigation";
import { ListMenu } from "./ListMenu";
import { Headers } from "./Headers";
import { PersonalСert } from "./PersonalСert";
import { RootСert } from "./RootСert";
import { OtherСert } from "./OtherCert";
import { PropertiesCert } from "./PropertiesCert";
import { SelectPersonalСert } from "./SelectPersonalСert";
import { SelectOtherСert } from "./SelectOtherСert";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { readCertKeys } from "../actions/CertKeysAction";
import { readFiles } from "../actions/index";
import { CreateCertificate } from "./CreateCertificate";

function mapStateToProps(state) {
   return {
      pesronalCertKeys: state.certKeys.pesronalCertKeys,
      files: state.files.files,
      lastlog: state.logger.lastlog
   };
}

function mapDispatchToProps(dispatch) {
   return {
      readFiles: bindActionCreators(readFiles, dispatch),
      readCertKeys: bindActionCreators(readCertKeys, dispatch)
   };
}

interface MainProps {
   navigation: any;
   files: any;
   pesronalCertKeys: any;
   lastlog: string;
   readCertKeys(): any;
   readFiles(): any;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
class Main extends React.Component<MainProps> {

   static navigationOptions = {
      header: null
   };

   render() {
      const { navigate } = this.props.navigation;
      const { files, pesronalCertKeys, lastlog } = this.props;
      let length = "выбрано файлов: " + files.length;
      let persCert = "личных сертификатов: " + pesronalCertKeys.filter(cert => cert.category.toUpperCase() === "MY").length;
      let lastlognote = lastlog ? "последняя запись: " + lastlog : "действий не совершалось";
      return (
         <Container style={styles.container}>
            <Headers title="КриптоАРМ" />
            <Content>
               <List>
                  {/*<ListMenu title="Создание самоподписанного сертификата" img={require("../../imgs/general/create_certificates_main_icon.png")}
                     nav={() => navigate("CreateCertificate")} />*/}
                  <ListMenu title="Подпись / Проверка подписи" img={require("../../imgs/general/sign_main_icon.png")}
                     note={length} nav={() => navigate("Signature")} />
                  <ListMenu title="Шифрование / Расшифрование" img={require("../../imgs/general/encode_main_icon.png")}
                     note={length} nav={() => navigate("Encryption")} />
                  <ListMenu title="Управление сертификатами" img={require("../../imgs/general/certificates_main_icon.png")}
                     note={persCert} nav={() => navigate("Certificate")} />
                  <ListMenu title="Журнал операций" img={require("../../imgs/general/journal_main_icon.png")}
                     note={lastlognote} nav={() => navigate("Journal")} />
               </List>
            </Content>
         </Container>
      );
   }

   componentDidMount() {
      this.props.readFiles();
      this.props.readCertKeys();
   }
}

export const App = StackNavigator({
   Main: { screen: Main },
   Signature: { screen: Signature },
   Encryption: { screen: Encryption },
   Certificate: { screen: Certificate },
   Journal: { screen: Journal },
   PersonalСert: { screen: PersonalСert },
   RootСert: { screen: RootСert },
   OtherСert: { screen: OtherСert },
   PropertiesCert: { screen: PropertiesCert },
   SelectPersonalСert: { screen: SelectPersonalСert },
   SelectOtherСert: { screen: SelectOtherСert },
   CreateCertificate: { screen: CreateCertificate }
});