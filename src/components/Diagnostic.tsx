import * as React from "react";
import { Container, List, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from "native-base";
import {Headers} from "./Headers";
import ListMenu from "./ListMenu";
import {DescriptionError} from "./DescriptionError";

interface DiagnosticProps {
  navigation: any;
}

export class Diagnostic extends React.Component<DiagnosticProps> {

  static navigationOptions = {
    header: null
  };
  render() {
    const { navigate, goBack } = this.props.navigation;
    return (
      <Container>
        <Headers title="Диагностика" goBack={() => goBack()}/>
        <Content>
          <List>
            <ListMenu title="Отсутствует лицензия на приложение"
            img={require("../../imgs/general/error_icon.png" )} note="Код: C1012"
            rightnote="Дата: 22.03.18" nav={() => navigate("DescriptionError")}/>
            <ListMenu title="Не установлены личные сертификаты"
            img={require("../../imgs/general/warning_icon.png")} note="Код: W34"
            rightnote="Дата: 22.03.18" nav={() => null}/>
            <ListMenu title="Доступна новая версия приложения"
            img={require("../../imgs/general/attention_icon.png")} note="Код: I04"
            rightnote="Дата: 26.03.18" nav={() => null}/>
          </List>
        </Content>
      </Container>
    );
  }
}