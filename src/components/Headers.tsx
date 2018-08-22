import * as React from "react";
import { Header, Title, Button, Left, Right, Body, Text, Icon } from "native-base";
import { Image } from "react-native";
import { styles } from "../styles";

interface HeadersProps {
	title: string;
	iconRight?: string;
	textRight?: string;
	filterEnabled?: boolean;
	type?: any;
	goHome?(): any;
	goBack?(): void;
	goRight?(): void;
}

export class Headers extends React.Component<HeadersProps> {

	render() {
		return (
			<Header style={styles.header} iosBarStyle={"light-content"}>
				{this.props.goBack
					? <Left>
						<Button transparent onPress={() => this.props.goBack()} style={{ width: 60, height: 50 }}>
							<Image style={{ width: 35, height: 35 }}
								source={require("../../imgs/general/back_icon.png")} />
						</Button>
						{this.props.goHome ? <Button style={{ width: 50, height: 50, position: "absolute", left: 60, top: 0 }} transparent onPressIn={() => { this.props.goHome(); }} >
							<Icon name="ios-home" style={{ color: "white" }} />
						</Button> : null}
					</Left>
					: <Left></Left>}
				<Body>
					<Title style={{ width: 300 }}><Text style={{ color: "white" }}>{this.props.title}</Text></Title>
				</Body>
				{this.props.iconRight
					? <Right>
						<Button transparent onPress={() => this.props.goRight()}>
							<Icon type={this.props.type ? this.props.type : null} style={this.props.filterEnabled ? { color: "lightgreen", fontSize: 32 } : { color: "white", fontSize: 32 }} name={this.props.iconRight} />
						</Button>
					</Right>
					: <Right></Right>}
			</Header>
		);
	}
}
