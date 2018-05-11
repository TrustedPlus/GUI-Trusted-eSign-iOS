import * as React from "react";
import { Container, Header, Item, Input, List, Content, Button, Icon, Text, View } from "native-base";
import { Image, AlertIOS } from "react-native";
import { Headers } from "./Headers";
import { ListMenu } from "./ListMenu";
import { styles } from "../styles";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addCert } from "../actions/index";
import { AddCertButton } from "../components/AddCertButton";

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

interface SelectOtherСertProps {
    navigation: any;
    pesronalCertKeys: any;
    addCert(uri: string, fileName: string, password: string): Function;
}

interface SelectOtherСertState {
    promptVisible: boolean;
    uri: string;
    fileName: string;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class SelectOtherСert extends React.Component<SelectOtherСertProps, SelectOtherСertState> {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            promptVisible: false,
            uri: "",
            fileName: "",
        };
    }

    ShowList(img) {
        return (
            this.props.pesronalCertKeys.map((cert, key) => cert.category.toUpperCase() === "MY" ? <ListMenu
                key={key}
                title={cert.subjectFriendlyName}
                note={cert.organizationName}
                provider={cert.provider}
                category={cert.category}
                img={img[key]}
                other
                issuerName={cert.issuerName}
                serialNumber={cert.serialNumber}
                rightimg={cert.hasPrivateKey ? require("../../imgs/general/key_icon.png") : null}
                nav={() => this.props.navigation.goBack()} /> : null));
    }

    render() {
        const { pesronalCertKeys } = this.props;
        const { navigate, goBack } = this.props.navigation;
        let img = [];
        for (let i = 0; i < pesronalCertKeys.length; i++) { // какое расширение у файлов
            switch (pesronalCertKeys[i].extension) {
                default:
                    img[i] = require("../../imgs/general/cert2_ok_icon.png"); break;
            }
        }
        return (
            <Container style={styles.container}>
                <Headers title="Выберите сертификат" goBack={() => goBack()} />
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