import * as React from "react";
import {Left, Body, ListItem, Thumbnail, Text} from "native-base";
import {Image} from "react-native";
import {styles} from "../styles";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {personalCertAdd, otherCertAdd} from "../actions/index";

interface ListItemProps {
    title: string;
    note?: string;
    rightnote?: string;
    img: any;
    rightimg?: any;
    arrow?: boolean;
    id?: number;
    verify?: number;
    checkbox?: boolean;
    personal?: boolean;
    issuerName?: string;
    serialNumber?: string;
    other?: boolean;
    provider?: string;
    nav(): void;
    personalCertAdd?(title: string, img: string, note: string, issuerName: string, serialNumber: string, provider: string): void;
    otherCertAdd?(title: string, img: string, note: string, issuerName: string, serialNumber: string, provider: string): void;
}

class ListMenu extends React.Component<ListItemProps, any> {

    constructor(props) {
        super(props);
        this.state = {active: false};
    }

    onPress() {
        if (this.props.checkbox) { this.state.active ? this.setState({active: false}) : this.setState({active: true}); }
        if (this.props.personal) {
            this.props.personalCertAdd(this.props.title, this.props.img, this.props.note, this.props.issuerName, this.props.serialNumber, this.props.provider);
        }
        if (this.props.other) {
            this.props.otherCertAdd(this.props.title, this.props.img, this.props.note, this.props.issuerName, this.props.serialNumber, this.props.provider);
        }
        this.props.nav();
    }

    render() {
        let rightimg = null;
        if (this.props.rightimg) { // условие на изображение справа
            rightimg = <Thumbnail small square style={{position: "absolute", right: 15, top: 15}} source={this.props.rightimg}/>;
        }
        return(
        <ListItem style={[styles.listItem, this.state.active ? {backgroundColor: "lightgrey"} : null]} avatar onPress={this.onPress.bind(this)} >
            <Left>
                <Thumbnail square style={styles.thumbnail} source={this.props.img}/>
                {this.props.verify === 1 ? <Image style={{position: "absolute", width: 25, height: 25, left: 40}} source={require("../../imgs/checkmark.png")}/> : null}
                {this.props.verify === -1 ? <Image style={{position: "absolute", width: 25, height: 25, left: 40}} source={require("../../imgs/cross.png")}/> : null}
            </Left>
            <Body>
                <Text style={styles.listItemText}>{this.props.title}</Text>
                <Text note style={{rightimg} ? {width: "80%"} : {}}>{this.props.note}</Text>
                <Text note style={{position: "absolute", right: 25, bottom: 10}}>{this.props.rightnote}</Text>
                {this.props.arrow ? <Text note style={{position: "absolute", right: 15, top: "50%"}}> > </Text> : null}
                {rightimg}
            </Body>

        </ListItem>
        );
    }
}

function mapStateToProps (state) {
    return {
        certificate: state.certificate
    };
  }

function mapDispatchToProps (dispatch) {
    return {
        personalCertAdd: bindActionCreators(personalCertAdd, dispatch),
        otherCertAdd: bindActionCreators(otherCertAdd, dispatch)
    };
  }

export default connect(mapStateToProps, mapDispatchToProps)(ListMenu);
