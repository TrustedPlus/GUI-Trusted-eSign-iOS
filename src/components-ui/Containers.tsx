import * as React from "react";
import { Container, Content, List, Footer, FooterTab, Button, Text } from "native-base";
import { NativeModules, Alert, AlertIOS } from "react-native";
import { Headers } from "../components/Headers";
import { FooterButton } from "../components/FooterButton";

import { ListMenu } from "../components/ListMenu";
import { styles } from "../styles";

interface ContainersProps {
   navigation: any;
   goBack: void;
}

export class Containers extends React.Component<ContainersProps, { providers: any, containers: any, activeButtons: any }> {

   static navigationOptions = {
      header: null
   };

   constructor(props) {
      super(props);

      this.state = {
         providers: [],
         containers: [],
         activeButtons: []
      };
   }

   footer_action(oldState, id) {
      let index = oldState.indexOf(id);
      if (index !== -1) {
         oldState.splice(index, 1); // удаление из массива
         return oldState;
      }
      oldState.push(id);
      return oldState; // добавление в массив
   }

   arrActiveContainer(id) {
      let newState = this.footer_action(this.state.activeButtons, id);
      this.setState({
         activeButtons: newState,
      });
   }

   showList() {
      if (this.state.containers[0]) {
         return (this.state.containers.map((containers, key) => <ListMenu
            key={key}
            note={"HDIMAGE"}
            checkbox
            title={containers.container}
            nav={() => this.arrActiveContainer(key)} />));
      }
   }

   deleteContainer() {
      AlertIOS.alert(
         "Вы уверены, что хотите удалить " + this.state.activeButtons.length + " сертификатов?",
         null,
         [
            {
               text: "Да", onPress: () => {
                  this.state.activeButtons.map((num) => {
                     NativeModules.Wrap_Main.deleteContainer(
                        this.state.containers[num]["fqcnA"],
                        this.state.providers[num]["type"],
                        this.state.providers[num]["name"],
                        (err, verify) => {
                           NativeModules.Wrap_Main.getProviders(
                              (err, verify) => {
                                 if (err) {
                                    console.log(err);
                                 } else {
                                    this.setState({ providers: verify });
                                    NativeModules.Wrap_Main.getContainers(
                                       this.state.providers[0]["type"],
                                       this.state.providers[0]["name"],
                                       (err, containers) => {
                                          if (err) {
                                             Alert.alert(err + "");
                                          } else {
                                             this.setState({ containers: containers });
                                          }
                                       });
                                 }
                              });
                              this.setState({ activeButtons: [] });
                              Alert.alert("Удаление прошло успешно");
                        });
                  });
               }
            },
            { text: "Отмена", onPress: () => null, style: "cancel" }
         ]
      );
   }

   render() {
      const { navigate, goBack } = this.props.navigation;
      console.log(this.state);
      return (
         <Container style={styles.container}>
            <Headers title="Контейнеры" goBack={() => goBack()} />
            <Content>
            {this.state.containers.length !== 0 ?
                  <List>{this.showList()}</List> :
                  <Text style={[styles.sign_enc_prompt, { paddingTop: "50%", paddingLeft: 5, paddingRight: 5 }]}>Контейнеров нет. Создайте или импортируйте сертификат с закрытым ключом.</Text>}
            </Content>
            {this.state.activeButtons.length ? <Footer>
               <FooterTab>
                  <FooterButton title="Удалить" icon="md-trash" nav={() => this.deleteContainer()} />
               </FooterTab>
            </Footer> : null}
         </Container>
      );
   }

   componentDidMount() {
      NativeModules.Wrap_Main.getProviders(
         (err, verify) => {
            if (err) {
               console.log(err);
            } else {
               this.setState({ providers: verify });
               NativeModules.Wrap_Main.getContainers(
                  this.state.providers[0]["type"],
                  this.state.providers[0]["name"],
                  (err, containers) => {
                     if (err) {
                        Alert.alert(err + "");
                     } else {
                        this.setState({ containers: containers });
                     }
                  });
            }
         });
   }
}