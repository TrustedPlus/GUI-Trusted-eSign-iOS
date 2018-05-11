import * as React from "react";
import { Button } from "native-base";
import { AlertIOS, Image } from "react-native";
import { DocumentPicker } from "react-native-document-picker";
import Prompt from "rn-prompt";

interface AddCertButtonProps {
   navigate: any;
   addCertFunc: Function;
}

interface AddCertButtonState {
   promptVisible: boolean;
   uri: string;
   fileName: string;
}

export class AddCertButton extends React.Component<AddCertButtonProps, AddCertButtonState> {

   constructor(props) {
      super(props);
      this.state = {
         promptVisible: false,
         uri: "",
         fileName: "",
      };
   }

   documentPicker() {
      DocumentPicker.show({
         filetype: ["public.item"]
      }, (error: any, res: any) => {
         let point, name, extension;
         point = res.fileName.indexOf(".");
         extension = res.fileName.substring(point + 1);
         if (extension === "pfx") {
            this.setState({ promptVisible: true, uri: res.uri, fileName: res.fileName });
         } else {
            this.props.addCertFunc(res.uri, res.fileName, null);
         }
      });
   }

   render() {
      return (<>
         <Button transparent style={{ position: "absolute", bottom: 40, right: 30 }} onPress={() => {
            AlertIOS.alert(
               "Добавление сертификата",
               null,
               [
                  { text: "Импортировать сертификат", onPress: () => this.documentPicker() },
                  { text: "Создать самоподписаный сертификат", onPress: () => this.props.navigate("CreateCertificate") },
                  { text: "Отмена", onPress: () => null, style: "cancel"}
               ]
            );
         }}>
            <Image style={{ width: 60, height: 60 }} source={require("../../imgs/general/add_icon.png")} />
         </Button>
         <Prompt
            title="Введите пароль для сертификата"
            textInputProps={{ secureTextEntry: true }}
            visible={this.state.promptVisible}
            submitText="Ввести"
            cancelText="Отмена"
            onCancel={() => {
               this.setState({
                  promptVisible: false
               });
            }}
            onSubmit={(password) => {

               this.setState({
                  promptVisible: false
               });
               this.props.addCertFunc(this.state.uri, this.state.fileName, password);
            }
            } /></>
      );
   }
}