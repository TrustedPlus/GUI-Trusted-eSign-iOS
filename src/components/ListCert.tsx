import * as React from "react";
import { Left, Right, Body, ListItem, Thumbnail, Text, Button, Icon } from "native-base";
import { TouchableWithoutFeedback } from "react-native";
import { styles } from "../styles";

interface ListCertProps {
	title: string;
	note?: string;
	rightnote?: string;
	img?: any;
	rightimg?: any;
	navigate?: Function;
	goBack?: Function;
	arrow?: boolean;
	cert?: object;
}

export class ListCert extends React.Component<ListCertProps, { active: boolean }> {

	constructor(props) {
		super(props);
		this.state = { active: false };
	}

	render() {
		let rightimg = null;
		if (this.props.rightimg) { // условие на изображение справа
			rightimg = <Thumbnail small square style={{ position: "absolute", right: 15, top: 15 }} source={this.props.rightimg} />;
		}
		return (
			<ListItem style={[styles.listItem, this.state.active ? { backgroundColor: "lightgrey" } : null]} avatar>
				<TouchableWithoutFeedback onPressIn={() => this.props.goBack()}><Left>
					<Thumbnail square style={styles.thumbnail} source={this.props.img} />
				</Left></TouchableWithoutFeedback>
				<TouchableWithoutFeedback onPressIn={() => this.props.goBack()}><Body>
					<Text style={styles.listItemText}>{this.props.title}</Text>
					<Text note style={{ rightimg } ? { width: "80%", color: "black" } : { color: "black" }}>{this.props.note}</Text>
					<Text note style={{ position: "absolute", right: 25, bottom: 10 }}>{this.props.rightnote}</Text>
					{rightimg}
				</Body></TouchableWithoutFeedback>
				{this.props.arrow ? <TouchableWithoutFeedback onPressIn={() => this.props.navigate("PropertiesCert", this.props.cert)}><Right style={{ width: 80 }} >
					<Icon style={{ position: "absolute", right: 15, top: "50%" }} name="ios-more" />
				</Right></TouchableWithoutFeedback> : null}
			</ListItem>
		);
	}
}
