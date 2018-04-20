import * as React from "react";
import { Container, List, Content } from "native-base";
import { Headers } from "./Headers";
import ListMenu from "./ListMenu";
import PersonalСert from "./PersonalСert";
import RootСert from "./PersonalСert";
import OtherСert from "./OtherCert";
import { styles } from "../styles";

interface CertificateProps {
  navigation: any;
}

export class Certificate extends React.Component<CertificateProps> {

  static navigationOptions = {
    header: null
  };

  render() {
    const { navigate, goBack } = this.props.navigation;
    return (
      <Container style={styles.container}>
        <Headers title="Сертификаты" goBack={() => goBack()} />
        <Content>
          <List>
            <ListMenu title="Личные сертификаты" img={require("../../imgs/general/certificates_menu_icon.png")}
              arrow nav={() => navigate("PersonalСert")} />
            {/*<ListMenu title="Сертификаты других пользователей" img={require("../../imgs/general/certificates_menu_icon.png")}
              arrow nav={() => navigate("OtherСert")}/>
            <ListMenu title="Промежуточные сертификаты" img={require("../../imgs/general/certificates_menu_icon.png")}
              arrow nav={() => null}/>*/}
            <ListMenu title="Доверенные корневые сертификаты" img={require("../../imgs/general/certificates_menu_icon.png")}
              arrow nav={() => navigate("RootСert")} />
          </List>
        </Content>
      </Container>
    );
  }
}