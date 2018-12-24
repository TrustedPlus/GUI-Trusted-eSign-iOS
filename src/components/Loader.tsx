import * as React from "react";
import { View, Text, Spinner } from "native-base";
import { styles } from "../styles";

interface LoaderProps {
	isFetching: boolean;
}

export class Loader extends React.Component<LoaderProps> {
	render() {
		return (
			this.props.isFetching
				? <View style={styles.loader}>
					<View style={styles.loaderView}>
						<Spinner color={"#be3817"} />
						<Text style={{ fontSize: 17, color: "grey" }}>Операция{"\n"}выполняется</Text>
					</View>
				</View>
				: null
		);
	}
}