import * as React from "react";
import {Left, Icon, Body, ListItem, Thumbnail} from "native-base";
import {Text, Image} from "react-native";
import {styles} from "../styles";

interface ListItemProps {
    title: string;
    img: any;
    nav(): void;
}

export class ListMenu extends React.PureComponent<ListItemProps> {

    onPress() {
        this.props.nav();
    }

    render() {
        return(
        <ListItem style={styles.listItem} avatar onPress={this.onPress.bind(this)} >
            <Left>
                <Thumbnail square style={styles.thumbnail} source={this.props.img}/>
            </Left>
            <Body>
                <Text style={styles.listItemText}>{this.props.title}</Text>
                <Text>выбрано файлов: 4</Text>
            </Body>
        </ListItem>
        );
    }
}
