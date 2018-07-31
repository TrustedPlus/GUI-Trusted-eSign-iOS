import * as React from "react";
import { List, View } from "native-base";
import { Dropdown } from "react-native-material-dropdown";

interface ListWithModalDropdownProps {
	text: string;
	defaultValue: string;
	changeValue: any;
	options: any;
	disabled?: boolean;
}

export class ListWithModalDropdown extends React.Component<ListWithModalDropdownProps> {

	render() {
		return (
			<List>
				<View style={{paddingLeft: 15, height: 65}}>
					<Dropdown
						disabled={this.props.disabled}
						onChangeText={this.props.changeValue}
						value={this.props.defaultValue}
						label={this.props.text}
						data={this.props.options}
						style={{fontSize: 14}} />
				</View>
			</List>
		);
	}
}