import * as React from "react";
import { Container, Header, Item, Input, List, Content, Button, Icon, Text, View } from "native-base";
import { Image } from "react-native";
import { Headers } from "./Headers";
import ListMenu from "./ListMenu";
import { styles } from "../styles";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addCert } from "../actions/index";
import { DocumentPicker, DocumentPickerUtil } from "react-native-document-picker";
import Prompt from "rn-prompt";

interface SelectOtherСertProps {
    navigation: any;
    pesronalCertKeys: any;
    addCert(uri: string, type: string, fileName: string, fileSize: number, password: string): void;
}

interface SelectOtherСertState {
    promptVisible: boolean;
    uri: string;
    type: string;
    fileName: string;
    fileSize: number;
}

class SelectOtherСert extends React.Component<SelectOtherСertProps, SelectOtherСertState> {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            promptVisible: false,
            uri: "",
            type: "",
            fileName: "",
            fileSize: 0,
        };
    }

    ShowList(img) {
        return (
            this.props.pesronalCertKeys.map((cert, key) => <ListMenu
                key={key}
                title={cert.issuerFriendlyName}
                note={cert.organizationName}
                provider={cert.provider}
                img={img[key]}
                other
                issuerName={cert.issuerName}
                serialNumber={cert.serialNumber}
                rightimg={cert.hasPrivateKey ? require("../../imgs/general/key_icon.png") : null}
                nav={() => this.props.navigation.goBack()} />));
    }

    documentPicker() {
        DocumentPicker.show({
            filetype: ["public.item"]
        }, (error: any, res: any) => {
            let point, name, extension;
            point = res.fileName.indexOf(".");
            extension = res.fileName.substring(point + 1);
            if (extension === "pfx") {
                this.setState({ promptVisible: true, uri: res.uri, type: res.type, fileName: res.fileName, fileSize: res.fileSize });
            } else {
                this.props.addCert(res.uri, res.type, res.fileName, res.fileSize, null);
            }
        });
    }

    render() {
        const { pesronalCertKeys, addCert } = this.props;
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
                <Headers title="Выберите сертификат" src={require("../../imgs/general/back_icon.png")} goBack={() => goBack()} />
                <Header searchBar>
                    <Item>
                        <Icon name="ios-search" />
                        <Input placeholder="Поиск" />
                    </Item>
                </Header>
                <Content>
                    <List>
                        {this.ShowList(img)}
                    </List>
                </Content>
                <Button transparent style={{ position: "absolute", bottom: 40, right: 30 }} onPress={() => { this.documentPicker(); }}>
                    <Image style={{ width: 60, height: 60 }} source={require("../../imgs/general/add_icon.png")} />
                </Button>
                <Prompt
                    title="Введите пароль для сертификата"
                    textInputProps={{secureTextEntry: true}}
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
                        addCert(this.state.uri, this.state.type, this.state.fileName, this.state.fileSize, password);
                    }
                    } />
            </Container>
        );
    }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(SelectOtherСert);