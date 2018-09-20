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
	checkbox?: boolean;
	numChain?: number;
	lengthChain?: number;
	active?: boolean;
	notconect?: boolean;
	selected?: boolean;
	styleImg?: object;
	styleText?: object;
	nav?(): void;
}

export class ListMenu extends React.Component<ListItemProps, { active: boolean }> {

	constructor(props) {
		super(props);
		this.state = this.props.active ? { active: true } : { active: false };
	}

	onPress() {
		if (this.props.selected !== undefined) {
			if (this.props.selected) {
				this.setState({ active: false });
			} else {
				this.setState({ active: true });
			}
		}
		if (this.props.checkbox !== undefined) { this.state.active ? this.setState({ active: false }) : this.setState({ active: true }); }
		this.props.nav ? this.props.nav() : null;
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
			<ListItem
				style={[styles.listItem, (this.props.selected !== undefined ? this.props.selected : this.state.active) ? { backgroundColor: "lightgrey" } : null]}
				thumbnail
				onPressIn={() => this.onPress()}>
				{this.props.img ? <Left>
					{this.props.numChain !== undefined
						? <>
							{this.props.notconect ? null : this.props.numChain !== 0 ? <View style={styles.vertfirst} /> : null}
							<View style={styles.numChain}>
								<Text style={{ textAlign: "center", lineHeight: 30, color: "darkblue" }}>{this.props.numChain + 1}</Text>
							</View>
							{this.props.notconect ? null : this.props.numChain + 1 !== this.props.lengthChain ? <View style={styles.vert} /> : null}
						</>
						: null}
					<Thumbnail square style={[styles.thumbnail, this.props.styleImg]} source={this.props.img} />
				</Left> : null}
				<Body>
					<Text style={[styles.listItemText, this.props.styleText]}>{this.props.title}</Text>
					<Text note style={{ rightimg } ? { width: "80%" } : {}}>{this.props.note}</Text>
					<Text note style={{ position: "absolute", right: 25, bottom: 10 }}>{this.props.rightnote}</Text>
					{rightimg}
					{righticon}
				</Body>
			</ListItem>
		);
	}
}
