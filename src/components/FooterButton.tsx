import * as React from "react";
import { Icon, Button, Text } from "native-base";
import { Image } from "react-native";

interface FooterButtonProps {
	title: string;
	icon?: any;
	img?: any;
	disabled?: boolean;
	style?: any;
	nav(): void;
}

export class FooterButton extends React.PureComponent<FooterButtonProps> {

	render() {
		const { disabled, style, icon, title, nav, img } = this.props;
		return (
			<Button disabled={disabled} style={[{ borderRadius: 0, backgroundColor: "#F8F8F8", borderColor: "#cbcbcb", borderTopWidth: 0.25 }, style]} vertical onPressIn={() => nav()}>
				{img
					? <Image source={img}
						style={disabled
							? {
								tintColor: "lightgrey",
								width: 30,
								height: 30
							} : {
								width: 30,
								height: 30
							}} />
					: <Icon name={icon} style={disabled
						? {
							color: "lightgrey",
							width: 150,
							height: 30,
							textAlign: "center"
						}
						: {
							color: "black",
							width: 150,
							height: 30,
							textAlign: "center"
						}} />}
				<Text style={disabled ? {
					color: "lightgrey",
					width: 150,
					textAlign: "center",
					fontSize: 13
				} : { color: "black", width: 150, textAlign: "center", fontSize: 13 }}>{title}</Text>
			</Button>
		);
	}
}


