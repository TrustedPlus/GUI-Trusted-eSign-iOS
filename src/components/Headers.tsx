import * as React from "react";
import { Header, Title, Button, Left, Right, Body, Text, Icon } from "native-base";
import { Image } from "react-native";
import { styles } from "../styles";

interface HeadersProps {
	title: string;
	iconRight?: string;
	imgRight?: any;
	textRight?: string;
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
						<Button transparent onPress={() => this.props.goBack()} style={{ width: 80, height: 50 }}>
							<Icon style={{ color: "white" }} name="arrow-back" />
						</Button>
					</Left>
					: <Left></Left>}
				<Body>
					<Title style={{ width: 300 }}><Text style={{ color: "white" }}>{this.props.title}</Text></Title>
				</Body>
				{this.props.iconRight
					? <Right>
						<Button transparent onPress={() => this.props.goRight()}>
							<Icon type={this.props.type ? this.props.type : null} style={{ color: "white", fontSize: 32 }} name={this.props.iconRight} />
						</Button>
					</Right>
					: this.props.imgRight
						? <Right>
							<Button transparent onPress={() => this.props.goRight()}>
								<Image style={{ width: 30, height: 30 }} source={this.props.imgRight} />
							</Button>
							</Right>
						: <Right></Right>}
			</Header>
		);
	}
}
