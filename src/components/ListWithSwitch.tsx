import * as React from "react";
import { List, ListItem, Text, Right, Body } from "native-base";
import { Switch } from "react-native";

interface ListWithSwitchProps {
	text: string;
	value: boolean;
	changeValue: any;
	last?: boolean;
	disabled?: boolean;
	styletext?: object;
}

export class ListWithSwitch extends React.Component<ListWithSwitchProps> {

	render() {
		return (
			<List>
				<ListItem icon last={this.props.last}>
					<Body>
						<Text style={[{fontSize: 14}, this.props.styletext, this.props.disabled ? {color: "grey"} : {}]}>{this.props.text}</Text>
					</Body>
					<Right>
						<Switch
							onValueChange={this.props.changeValue}
							value={this.props.value}
							disabled={this.props.disabled} />
					</Right>
				</ListItem>
			</List>
		);
	}
}