import * as React from "react";
import { styles } from "../styles";
import { Headers } from "../components/Headers";
import { Container, List } from "native-base";
import { ListMenu } from "../components/ListMenu";
import { iconSelection } from "../utils/forListFiles";

import { connect } from "react-redux";

function mapStateToProps(state) {
	return {
		files: state.files.files
	};
}

interface IFile {
	extension: string;
	name: string;
	date: string;
	month: string;
	year: string;
	time: string;
	verify: number;
}

interface DocumentsProps {
	navigation: any;
	goBack: void;
	files: IFile[];
}

@(connect(mapStateToProps) as any)
export class Documents extends React.Component<DocumentsProps> {

	static navigationOptions = {
		header: null
	};

	showList(img) {
		return (
			this.props.files.map((file, key) => <ListMenu
				key={key + file.time}
				title={file.name}
				note={file.date + " " + file.month + " " + file.year + ", " + file.time}
				righticon={"ios-more"}
				img={img[key]}
				nav={() => null} />));
	}

	render() {
		let img = iconSelection(this.props.files, this.props.files.length);
		const { navigate, goBack } = this.props.navigation;
		return (
			<Container style={styles.container}>
				<Headers title="Документы" goBack={() => goBack()} />
				<List>{this.showList(img)}</List>
			</Container>
		);
	}
}