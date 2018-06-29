import * as React from "react";
import { List, View } from "native-base";
import { Dropdown } from "react-native-material-dropdown";

interface ListWithModalDropdownProps {
	text: string;
	defaultValue: string;
	changeValue: any;
	options: any;
}

export class ListWithModalDropdown extends React.Component<ListWithModalDropdownProps> {

	render() {
		return (
			<List>
				<View style={{paddingLeft: 15}}>
					<Dropdown
						onChangeText={this.props.changeValue}
						value={this.props.defaultValue}
						label={this.props.text}
						data={this.props.options} />
				</View>
			</List>
		);
	}
}