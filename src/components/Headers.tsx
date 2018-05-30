import * as React from "react";
import { Header, Title, Button, Left, Right, Body, Text, Icon } from "native-base";
import { Image } from "react-native";
import { styles } from "../styles";

interface HeadersProps {
	title: string;
	goHome?(): any;
	goBack?(): void;
}

export class Headers extends React.Component<HeadersProps> {

	render() {
		return (
			<Header style={styles.header} iosBarStyle={"light-content"}>
				{this.props.goBack ? <Left style={styles.left}>
					<Button transparent onPress={() => this.props.goBack()} style={this.props.goHome ? {position: "absolute", left: 0} : null}>
						<Image style={styles.headerImage}
							source={require("../../imgs/general/back_icon.png")} />
					</Button>
					{this.props.goHome ? <Button transparent onPress={() => { this.props.goHome(); }} >
						<Icon name="home" style={{position: "absolute", left: 60, color: "white"}}/>
					</Button> : null}
				</Left> : null}
				<Body>
					<Title><Text style={{ color: "white" }}>{this.props.title}</Text></Title>
				</Body>
				{/*<Right style={styles.right}>
						  <Button transparent>
								<Image style={styles.headerImage} source={require("../../imgs/general/contextm_menu_icon.png")}/>
						  </Button>
		  </Right>*/}
			</Header>
		);
	}
}
