import * as React from "react";
import { Container, List, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from "native-base";
import {Headers} from "./Headers";
import {ListMenu} from "./ListMenu";
import {DescriptionError} from "./DescriptionError";

interface DiagnosticProps {
  navigation: any;
}

export class Diagnostic extends React.Component<DiagnosticProps> {

  static navigationOptions = {
    header: null
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <Headers title="Диагностика" goBack={() => this.props.navigation.goBack()}/>
        <Content>
          <List>
            <ListMenu title="Отсутствует лицензия на приложение"
            img={require("../../imgs/general/error_icon.png" )} nav={() => navigate("DescriptionError")}/>
            <ListMenu title="Не установлены личные сертификаты"
            img={require("../../imgs/general/warning_error.png")} nav={() => navigate("DescriptionError")}/>
            <ListMenu title="Доступна новая версия приложения"
            img={require("../../imgs/general/attention_icon.png")} nav={() => navigate("DescriptionError")}/>
          </List>
        </Content>
      </Container>
    );
  }
}