import * as React from "react";
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from "native-base";
import {Image} from "react-native";
import {styles} from "../styles";

interface HeadersProps {
    title: string;
    src?: any;
    goBack(): void;
  }

export class Headers extends React.Component<HeadersProps> {

    onPress() {
        this.props.goBack();
    }

    render() {
        console.log(this.props.src);
        return (
            <Header style={styles.header}>
                <Left style={styles.left}>
                    <Button transparent onPress={this.onPress.bind(this)}>
                        <Image style={styles.headerImage}
                        source={this.props.src ? this.props.src : require("../../imgs/general/home_icon.png")}/>
                    </Button>
                </Left>
                <Body>
                    <Title><Text style={{color: "white" }}>{this.props.title}</Text></Title>
                </Body>
                <Right style={styles.right}>
                    <Image style={styles.headerImage}
                        source={require("../../imgs/general/contextm_menu_icon.png")}/>
                </Right>
            </Header>
        );
    }
}
