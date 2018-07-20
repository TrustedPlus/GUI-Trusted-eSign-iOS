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
					<Button transparent onPress={() => this.props.goBack()} style={[{width: 50, height: 50}]}>
						<Image style={{width: 35, height: 35}}
							source={require("../../imgs/general/back_icon.png")} />
					</Button>
					{this.props.goHome ? <Button style={{width: 50, height: 50, position: "absolute", left: 60, top: 0}} transparent onPressIn={() => { this.props.goHome(); }} >
						<Icon name="ios-home" style={{color: "white"}}/>
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
