import * as React from "react";
import {Left, Right, Icon, Body, ListItem, Thumbnail} from "native-base";
import {Text, Image} from "react-native";
import {styles} from "../styles";

interface ListItemProps {
    title: string;
    note?: string;
    rightnote?: string;
    img: any;
    rightimg?: any;
    arrow?: boolean;
    id?: number;
    checkbox?: boolean;
    nav(): void;
}

export class ListMenu extends React.PureComponent<ListItemProps, any> {

    constructor(props) {
        super(props);
        this.state = {active: false};
    }

    onPress() {
        if (this.props.checkbox) this.state.active ? this.setState({active: false}) : this.setState({active: true});
        this.props.nav();
    }

    render() {
        let rightimg = null;
        if (this.props.rightimg) {
            rightimg = <Thumbnail small square style={{position: "absolute", right: 15, top: 15}} source={this.props.rightimg}/>;
        }
        let arrow = null;
        if (this.props.arrow) {
            arrow = <Text note style={{position: "absolute", right: 15, top: "50%"}}> > </Text>;
        }

        let styleActive = null;

        if (this.state.active) {
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
