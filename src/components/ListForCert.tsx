import * as React from "react";
import { ListItem, Text } from "native-base";
import { styles } from "../styles";

interface ListForCertProps {
	title: string;
	value?: string;
	first?: boolean;
	itemHeader?: boolean;
}

export class ListForCert extends React.Component<ListForCertProps> {

	render() {
		return (
			<ListItem first={this.props.first} itemHeader={this.props.itemHeader} style={[this.props.itemHeader ? { paddingTop: 25 } : null]}>
				<Text style={[{ width: "45%" }, this.props.value ? { color: "grey" } : { fontSize: 20, color: "#545454" }]}>{this.props.title}</Text>
				{this.props.value ? <Text style={styles.prop_cert_righttext}>{this.props.value}</Text> : null}
			</ListItem>
		);
	}
}