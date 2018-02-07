import * as React from "react";
import {Left, Icon, Body, ListItem, Thumbnail} from "native-base";
import {Text, Image} from "react-native";
import {styles} from "../styles";

interface SideListItemProps {
    title: string;
    img: any;
    nav(): void;
}

export class SideListItem extends React.PureComponent<SideListItemProps> {

    onPress() {
        this.props.nav();
    }

    render() {
        return(
        <ListItem style={styles.sideListItem} onPress={this.onPress.bind(this)}>
            <Thumbnail small square style={{marginRight: 5}} source={this.props.img}/>
            <Text>{this.props.title}</Text>
        </ListItem>
        );
    }
}