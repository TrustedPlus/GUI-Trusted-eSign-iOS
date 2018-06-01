import * as React from "react";
import { styles } from "../styles";
import { Headers } from "../components/Headers";
import { Container, Content } from "native-base";

interface DocumentsProps {
	navigation: any;
	goBack: void;
}

export class Documents extends React.Component<DocumentsProps> {

	static navigationOptions = {
		header: null
	};

	render() {
		const { navigate, goBack } = this.props.navigation;
		return (
			<Container style={styles.container}>
				<Headers title="Документы" goBack={() => goBack()} />
			</Container>
		);
	}
}