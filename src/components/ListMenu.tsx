import * as React from "react";
import { bindActionCreators } from "redux";

import { Left, Right, Body, ListItem, Thumbnail, Text, Icon } from "native-base";
import { Image } from "react-native";
import { styles } from "../styles";

interface ListItemProps {
	title: string;
	note?: string;
	rightnote?: string;
	img?: any;
	rightimg?: any;
	verify?: number;
	checkbox?: boolean;
	nav(): void;
}

export class ListMenu extends React.Component<ListItemProps, { active: boolean }> {

	constructor(props) {
		super(props);
		this.state = { active: false };
	}

	onPress() {
		if (this.props.checkbox) { this.state.active ? this.setState({ active: false }) : this.setState({ active: true }); }
		this.props.nav();
	}

	render() {
		let rightimg = null;
		if (this.props.rightimg) { // условие на изображение справа
			rightimg = <Thumbnail small square style={{ position: "absolute", right: 15, top: 15 }} source={this.props.rightimg} />;
		}
		return (
			<ListItem style={[styles.listItem, this.state.active ? { backgroundColor: "lightgrey" } : null]} avatar onPress={this.onPress.bind(this)} >
				{this.props.img ? <Left>
					<Thumbnail square style={styles.thumbnail} source={this.props.img} />
					{this.props.verify === 1 ? <Image style={{ position: "absolute", width: 25, height: 25, left: 40 }} source={require("../../imgs/checkmark.png")} /> : null}
					{this.props.verify === -1 ? <Image style={{ position: "absolute", width: 25, height: 25, left: 40 }} source={require("../../imgs/cross.png")} /> : null}
				</Left> : null}
				<Body>
					<Text style={styles.listItemText}>{this.props.title}</Text>
					<Text note style={{ rightimg } ? { width: "80%" } : {}}>{this.props.note}</Text>
					<Text note style={{ position: "absolute", right: 25, bottom: 10 }}>{this.props.rightnote}</Text>
					{rightimg}
				</Body>
			</ListItem>
		);
	}
}
