import * as React from "react";
import { Container, List, Content, Title } from "native-base";
import { Headers } from "../components/Headers";
import { ListMenu} from "../components/ListMenu";
import { styles } from "../styles";
import { AddCertButton } from "../components/AddCertButton";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addCert } from "../actions/index";

function mapStateToProps(state) {
  return {
     certificates: state.certificates.certificates
  };
}

function mapDispatchToProps(dispatch) {
  return {
     addCert: bindActionCreators(addCert, dispatch)
  };
}

interface SelectCertProps {
  navigation: any;
  certificates: any;
  addCert(uri: string, fileName: string, password: string): Function;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class SelectCert extends React.Component<SelectCertProps> {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.props.navigation.state.key = "Encryption";
}

  render() {
    const { navigate, goBack } = this.props.navigation;
    let persCert = "количество сертификатов: " + this.props.certificates.filter((cert) => cert.category.toUpperCase() === "MY").length;
    let otherCert = "количество сертификатов: " + this.props.certificates.filter((cert) => cert.category.toUpperCase() === "OTHERS").length;
    return (
      <Container style={styles.container}>
        <Headers title="Выберите категорию сертификата" goBack={() => goBack()} />
        <Content>
          <List>
            <ListMenu title="Личные сертификаты" img={require("../../imgs/general/certificates_menu_icon.png")}
              note={persCert} nav={() => navigate("SelectPersonalСert", {enc: true})} />
            <ListMenu title="Сертификаты других пользователей" img={require("../../imgs/general/certificates_menu_icon.png")}
              note={otherCert} nav={() => navigate("SelectOtherСert")}/>
          </List>
        </Content>
        <AddCertButton navigate={(page) => navigate(page)} addCertFunc={(uri, fileName, password) => this.props.addCert(uri, fileName, password)} />
      </Container>
    );
  }
}