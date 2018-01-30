import * as React from "react";
import {Left, Icon, Body, ListItem, Thumbnail} from "native-base";
import {Text, Image} from "react-native";

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
        <ListItem style={{marginLeft: 0}} avatar onPress={this.onPress.bind(this)} >
            <Left>
                <Thumbnail style={{marginLeft: 5}} source={this.props.img}/>
            </Left>
            <Body>
                <Text style={{fontSize: 20}}>{this.props.title}</Text>
                <Text>выбрано файлов: 4</Text>
            </Body>
        </ListItem>
        );
    }
}
