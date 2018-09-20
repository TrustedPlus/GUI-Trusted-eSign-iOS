import * as React from "react";
import { styles } from "../styles";
import { Headers } from "../components/Headers";
import { Container, List, Text, View, Button, Content } from "native-base";
import { Image, RefreshControl, ScrollView, AlertIOS } from "react-native";
import { ListMenu } from "../components/ListMenu";
import { iconSelection } from "../utils/forListFiles";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addSingleFileInWorkspaceSign, addSingleFileInWorkspaceEnc } from "../actions/workspaceAction";

function mapStateToProps(state) {
	return {
		files: state.files.files,
		workspaceSignFiles: state.workspaceSign.files,
		workspaceEncFiles: state.workspaceEnc.files
	};
}

function mapDispatchToProps(dispatch) {
	return {
		addSingleFileInWorkspaceSign: bindActionCreators(addSingleFileInWorkspaceSign, dispatch),
		addSingleFileInWorkspaceEnc: bindActionCreators(addSingleFileInWorkspaceEnc, dispatch)
	};
}


interface ISelectedFiles {
	arrNum: Array<number>;
	arrExtension: Array<string>;
}

interface IFile {
	extension: string;
	extensionAll: string;
	name: string;
	date: string;
	month: string;
	year: string;
	time: string;
	verify: number;
}

interface NotSelectedDocumentsProps {
	navigation: any;
	goBack: void;
	files: IFile[];
	workspaceSignFiles?: IFile[];
	workspaceEncFiles?: IFile[];
	addSingleFileInWorkspaceSign?(files): void;
	addSingleFileInWorkspaceEnc?(files): void;
}

interface NotSelectedDocumentsState {
	selectedFiles?: number[];
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class NotSelectedDocuments extends React.Component<NotSelectedDocumentsProps, NotSelectedDocumentsState> {

	constructor(props) {
		super(props);

		this.state = {
			selectedFiles: []
		};
	}

	changeSelectedRequests(oldSelectedFiles, key) {
		let index = oldSelectedFiles.indexOf(key);
		let newSelectedFiles;
		if (index !== -1) {
			oldSelectedFiles.splice(index, 1); // удаление из массива
		} else {
			oldSelectedFiles.push(key);
		}
		newSelectedFiles = oldSelectedFiles;
		return newSelectedFiles; // добавление в массив
	}

	showList(img) {
		const { from } = this.props.navigation.state.params;
		return this.props.files.map((file, key) => {
			let notShow = false;
			if (from === "sign") {
				this.props.workspaceSignFiles.map((workspaceSignFile) => {
					if (JSON.stringify(file) === JSON.stringify(workspaceSignFile)) {
						notShow = true;
					}
				});
			} else {
				this.props.workspaceEncFiles.map((workspaceEncFile) => {
					if (JSON.stringify(file) === JSON.stringify(workspaceEncFile)) {
						notShow = true;
					}
				});
			}
			if (notShow) {
				return null;
			} else {
				return (
					<ListMenu
						key={key + file.time}
						title={file.name + (file.extensionAll === "" ? "" : "." + file.extensionAll)}
						note={file.date + " " + file.month + " " + file.year + ", " + file.time}
						checkbox
						img={img[key]}
						nav={() => {
							const newSelectedFiles = this.changeSelectedRequests(this.state.selectedFiles, key);
							this.setState({ selectedFiles: newSelectedFiles });
						}} />
				);
			}
		});
	}

	addSelectedFilesInWorkspace() {
		const { from } = this.props.navigation.state.params;
		if (from === "sign") {
			for (let i = 0; i < this.state.selectedFiles.length; i++) {
				this.props.addSingleFileInWorkspaceSign(this.props.files[this.state.selectedFiles[i]]);
			}
		} else {
			for (let i = 0; i < this.state.selectedFiles.length; i++) {
				this.props.addSingleFileInWorkspaceEnc(this.props.files[this.state.selectedFiles[i]]);
			}
		}
		this.props.navigation.goBack();
	}

	private getFilesView(files, img) {
		if (files.length) {
			return (
				<ScrollView>
					<List>{this.showList(img)}</List>
				</ScrollView>
			);
		}

		return (
			<View style={styles.sign_enc_view}>
				<Text style={styles.sign_enc_prompt} >[Нет невыбраных файлов]</Text>
			</View>
		);
	}

	render() {
		const { files } = this.props;
		const { selectedFiles } = this.state;
		const { goBack } = this.props.navigation;
		const img = iconSelection(this.props.files, this.props.files.length);
		const filesView = this.getFilesView(files, img);

		let viewNumSelectFiles = null;
		// if (selectedFiles.length) { // выбраны ли файлы
		viewNumSelectFiles = <Text style={styles.selectFiles}>
			выбрано файлов: {selectedFiles.length} </Text>;
		/* } else {
			if (this.props.files.length) {
				viewNumSelectFiles = <Text style={styles.selectFiles}>
					всего файлов: {this.state.numNotShowFiles}</Text>;
			} else {
				viewNumSelectFiles = null;
			}
		} */

		return (
			<Container style={styles.container}>
				<Headers title="Документы" goBack={() => goBack()} />
				<View style={styles.sign_enc_view}>
					<Text style={styles.sign_enc_title}>Файлы</Text>
					{viewNumSelectFiles}
				</View>
				{filesView}
				{this.state.selectedFiles.length
					? <Button
						transparent
						style={{ position: "absolute", bottom: 60, right: 30 }}
						onPressIn={() => this.addSelectedFilesInWorkspace()}>
						<Image
							style={{ width: 60, height: 60 }}
							source={require("../../imgs/general/confirm.png")} />
					</Button>
					: null}
			</Container>
		);
	}
}