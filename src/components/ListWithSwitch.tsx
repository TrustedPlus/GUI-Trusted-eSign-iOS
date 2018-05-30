import * as React from "react";
import { List, ListItem, Text, Right, Body } from "native-base";
import { Switch } from "react-native";

interface ListWithSwitchProps {
	text: string;
	value: boolean;
	changeValue: any;
	last?: boolean;
}

export class ListWithSwitch extends React.Component<ListWithSwitchProps> {

	render() {
		return (
			<List>
				<ListItem icon last={this.props.last}>
					<Body>
						<Text>{this.props.text}</Text>
					</Body>
					<Right>
						<Switch
							onValueChange={this.props.changeValue}
							value={this.props.value} />
					</Right>
				</ListItem>
			</List>
		);
	}
}