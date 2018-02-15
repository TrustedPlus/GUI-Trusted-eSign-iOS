import * as React from "react";
import {Left, Right, Icon, Body, ListItem, Thumbnail} from "native-base";
import {Text, Image} from "react-native";
import {styles} from "../styles";

import {bindActionCreators} from "redux";
import { connect } from "react-redux";
import {certAdd} from "../actions/index";

interface ListItemProps {
    title: string;
    note?: string;
    rightnote?: string;
    img: any;
    rightimg?: any;
    arrow?: boolean;
    id?: number;
    checkbox?: boolean;
    check?: boolean;
    nav(): void;
    certAdd?(...any): void;
}

class ListMenu extends React.PureComponent<ListItemProps, any> {

    constructor(props) {
        super(props);
        this.state = {active: false};
    }

    onPress() {
        if (this.props.checkbox) this.state.active ? this.setState({active: false}) : this.setState({active: true});
        if (this.props.check) this.props.certAdd(this.props.title, this.props.img, this.props.note);
        this.props.nav();
    }

    render() {
        let rightimg = null;
        if (this.props.rightimg) { // условие на изображение справа
            rightimg = <Thumbnail small square style={{position: "absolute", right: 15, top: 15}} source={this.props.rightimg}/>;
        }
        let arrow = null;
        if (this.props.arrow) { // условие на указатель
            arrow = <Text note style={{position: "absolute", right: 15, top: "50%"}}> > </Text>;
        }

        let styleActive = null;

        if (this.state.active) { // выбран ли файл
            styleActive = {backgroundColor: "lightgrey"};
        }
        return(
        <ListItem style={[styles.listItem, styleActive]} avatar onPress={this.onPress.bind(this)} >
            <Left>
                <Thumbnail square style={styles.thumbnail} source={this.props.img}/>
            </Left>
            <Body>
                <Text style={styles.listItemText}>{this.props.title}</Text>
                <Text note style={{rightimg} ? {width: "80%"} : {}}>{this.props.note}</Text>
                <Text note style={{position: "absolute", right: 25, bottom: 10}}>{this.props.rightnote}</Text>
                {arrow}
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
      certAdd: bindActionCreators(certAdd, dispatch)
    };
  }

export default connect(mapStateToProps, mapDispatchToProps)(ListMenu);
