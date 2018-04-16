import * as React from "react";
import { FooterTab, Icon, Button, Text } from "native-base";
import { styles } from "../styles";

interface FooterButtonProps {
    title: string;
    icon?: any;
    disabled?: boolean;
    nav(): void;
}

export class FooterButton extends React.Component<FooterButtonProps> {

    render() {
        return (
                <Button disabled={this.props.disabled} style={[{borderRadius: 0, width: 120}, styles.footer]} vertical onPress={() => this.props.nav()}>
                    <Icon style={{ color: "white", width: 150, textAlign: "center"  }} name={this.props.icon} />
                    <Text style={{ color: "white", width: 150, textAlign: "center" }}>{this.props.title}</Text>
                </Button>
        );
    }
}


