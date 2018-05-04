import * as React from "react";
import { FooterTab, Icon, Button, Text } from "native-base";
import { styles } from "../styles";

interface FooterButtonProps {
    title: string;
    icon?: any;
    disabled?: boolean;
    classic?: boolean;
    nav(): void;
}

export class FooterButton extends React.Component<FooterButtonProps> {

    render() {
        return (
            <Button disabled={this.props.disabled} style={ this.props.classic ? this.props.disabled ? { backgroundColor: "#F8F8F8", borderRadius: 0, borderColor: "#cbcbcb", borderTopWidth: 0.25 } : { borderRadius: 0 } : { borderRadius: 0 }} vertical onPress={() => this.props.nav()}>
                <Icon style={this.props.classic ? this.props.disabled ? { color: "grey", width: 150, textAlign: "center"} : { color: "black", width: 150, textAlign: "center" } : { color: "white", width: 150, textAlign: "center" }} name={this.props.icon} />
                <Text style={this.props.classic ? this.props.disabled ? { color: "grey", width: 150, textAlign: "center", fontSize: 13 } : { color: "black", width: 150, textAlign: "center", fontSize: 13 } : { color: "white", width: 150, textAlign: "center", fontSize: 13 }}>{this.props.title}</Text>
            </Button>
        );
    }
}


