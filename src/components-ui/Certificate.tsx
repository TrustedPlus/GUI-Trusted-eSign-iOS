import * as React from "react";
import { Container, List, Content, Title } from "native-base";
import { Headers } from "../components/Headers";
import { ListMenu} from "../components/ListMenu";
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
              nav={() => navigate("ListCertCategory", {title: "Личные сертификаты", category: ["MY", null]})} />
            <ListMenu title="Сертификаты других пользователей" img={require("../../imgs/general/certificates_menu_icon.png")}
              nav={() => navigate("ListCertCategory", {title: "Сертификаты других пользователей", category: ["OTHERS", null]})}/>
            <ListMenu title="Промежуточные сертификаты" img={require("../../imgs/general/certificates_menu_icon.png")}
              nav={() => navigate("ListCertCategory", {title: "Промежуточные сертификаты", category: ["ADDRESSBOOK", null]})}/>
            <ListMenu title="Доверенные корневые сертификаты" img={require("../../imgs/general/certificates_menu_icon.png")}
              nav={() => navigate("ListCertCategory", {title: "Доверенные корневые сертификаты", category: ["ROOT", "TRUST"]})} />
          </List>
        </Content>
      </Container>
    );
  }
}