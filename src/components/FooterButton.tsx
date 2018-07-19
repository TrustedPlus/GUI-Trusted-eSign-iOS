import * as React from "react";
import { Icon, Button, Text } from "native-base";

interface FooterButtonProps {
	title: string;
	icon?: any;
	disabled?: boolean;
	style?: any;
	nav(): void;
}

export class FooterButton extends React.PureComponent<FooterButtonProps> {

	render() {
		const { disabled, style, icon, title, nav } = this.props;
		return (
			<Button disabled={disabled} style={[{borderRadius: 0, backgroundColor: "#F8F8F8", borderColor: "#cbcbcb", borderTopWidth: 0.25}, style]} vertical onPress={() => nav()}>
				<Icon style={disabled ? {
					color: "lightgrey",
					width: 150,
					textAlign: "center" }
					: { color: "black",
					width: 150,
					textAlign: "center" }} name={icon} />
				<Text style={disabled ? {
					color: "lightgrey",
					width: 150,
					textAlign: "center",
					fontSize: 13 } : { color: "black", width: 150, textAlign: "center", fontSize: 13 }}>{title}</Text>
			</Button>
		);
	}
}


