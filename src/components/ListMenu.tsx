import * as React from "react";
import { Left, Body, ListItem, Thumbnail, Text, Icon, View } from "native-base";
import { Image } from "react-native";
import { styles } from "../styles";

interface ListItemProps {
	title: string;
	note?: string;
	rightnote?: string;
	img?: any;
	rightimg?: any;
	righticon?: string;
	verify?: number;
	checkbox?: boolean;
	numChain?: number;
	lengthChain?: number;
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
		let rightimg, righticon = null;
		if (this.props.rightimg) { // условие на изображение справа
			rightimg = <Thumbnail small square style={{ position: "absolute", right: 15, top: 15 }} source={this.props.rightimg} />;
		}

		if (this.props.righticon) { // условие на иконку справа
			righticon = <Icon style={{ position: "absolute", right: 15, top: 15 }} name={this.props.righticon} />;
		}
		return (
			<ListItem style={[styles.listItem, this.state.active ? { backgroundColor: "lightgrey" } : null]} avatar onPress={this.onPress.bind(this)} >
				{this.props.img ? <Left>
					{this.props.numChain !== undefined
						? <>
							{ this.props.numChain !== 0 ? <View style={styles.vertfirst}/> : null }
							<View style={styles.numChain}>
								<Text style={{ textAlign: "center", lineHeight: 30, color: "darkblue" }}>{this.props.numChain + 1}</Text>
							</View>
							{ this.props.numChain + 1 !== this.props.lengthChain ? <View style={styles.vert}/> : null }
						</>
						: null}
					<Thumbnail square style={styles.thumbnail} source={this.props.img} />
					{this.props.verify === 1 ? <Image style={{ position: "absolute", width: 25, height: 25, left: 40 }} source={require("../../imgs/checkmark.png")} /> : null}
					{this.props.verify === -1 ? <Image style={{ position: "absolute", width: 25, height: 25, left: 40 }} source={require("../../imgs/cross.png")} /> : null}
				</Left> : null}
				<Body>
					<Text style={styles.listItemText}>{this.props.title}</Text>
					<Text note style={{ rightimg } ? { width: "80%" } : {}}>{this.props.note}</Text>
					<Text note style={{ position: "absolute", right: 25, bottom: 10 }}>{this.props.rightnote}</Text>
					{rightimg}
					{righticon}
				</Body>
			</ListItem>
		);
	}
}
