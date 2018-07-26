import * as React from "react";
import { styles } from "../styles";
import { Headers } from "../components/Headers";
import { Container, List, Text, View, Button, Content } from "native-base";
import { Image, RefreshControl, ScrollView } from "react-native";
import { ListMenu } from "../components/ListMenu";
import { iconSelection } from "../utils/forListFiles";
import { FooterDoc } from "./FooterDoc";
import { DocumentPicker } from "react-native-document-picker";
import { AddCertButton } from "../components/AddCertButton";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { readFiles, addFiles } from "../actions";

function mapStateToProps(state) {
	return {
		files: state.files.files,
		isFetching: state.files.isFetching
	};
}

function mapDispatchToProps(dispatch) {
	return {
		readFiles: bindActionCreators(readFiles, dispatch),
		addFiles: bindActionCreators(addFiles, dispatch)
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

interface DocumentsProps {
	navigation: any;
	goBack: void;
	files: IFile[];
	isFetching: boolean;
	readFiles(): void;
	addFiles(uri: string, fileName: string): void;
}

interface DocumentsState {
	selectedFiles?: ISelectedFiles;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class Documents extends React.Component<DocumentsProps, DocumentsState> {

	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);

		this.state = {
			selectedFiles: {
				arrNum: [],
				arrExtension: []
			}
		};
	}

	changeSelectedRequests(oldSelectedFiles, key, extension) {
		let index = oldSelectedFiles.arrNum.indexOf(key);
		let newSelectedFiles;
		if (index !== -1) {
			oldSelectedFiles.arrNum.splice(index, 1); // удаление из массива
			oldSelectedFiles.arrExtension.splice(index, 1);
		} else {
			oldSelectedFiles.arrNum.push(key);
			oldSelectedFiles.arrExtension.push(extension);
		}
		newSelectedFiles = oldSelectedFiles;
		return newSelectedFiles; // добавление в массив
	}

	showList(img) {
		return (
			this.props.files.map((file, key) => <ListMenu
				key={key + file.time}
				title={file.name + "." + file.extensionAll}
				note={file.date + " " + file.month + " " + file.year + ", " + file.time}
				checkbox
				verify={file.verify}
				img={img[key]}
				nav={() => {
					const newSelectedFiles = this.changeSelectedRequests(this.state.selectedFiles, key, file.extension);
					this.setState({ selectedFiles: { arrNum: newSelectedFiles.arrNum, arrExtension: newSelectedFiles.arrExtension } });
				}} />));
	}

	documentPicker() {
		DocumentPicker.show({
			filetype: ["public.item"]
		}, (error: any, res: any) => {
			this.props.addFiles(res.uri, res.fileName);
		});
	}

	clearselectedFiles() {
		this.setState({
			selectedFiles: {
				arrNum: [],
				arrExtension: []
			}
		});
	}

	private getFilesView(files, isFetching, img, readFiles) {
		if (files.length) {
			return (
				<ScrollView refreshControl={
					<RefreshControl
						refreshing={isFetching}
						onRefresh={() => {
							readFiles();
							this.clearselectedFiles();
						}} />}>
					<List>{this.showList(img)}</List>
				</ScrollView>
			);
		}

		return (
			<View style={styles.sign_enc_view}>
				<Text
					style={styles.sign_enc_prompt}
					onPress={() => this.documentPicker()}>[Добавьте файлы]</Text>
			</View>
		);
	}

	render() {
		const { files, isFetching, readFiles } = this.props;
		const { selectedFiles } = this.state;
		const { navigate, goBack } = this.props.navigation;
		const img = iconSelection(this.props.files, this.props.files.length);
		const filesView = this.getFilesView(files, isFetching, img, readFiles);

		let viewNumSelectFiles = null;
		if (selectedFiles.arrNum.length) { // выбраны ли файлы
			viewNumSelectFiles = <Text style={styles.selectFiles}>
				выбрано файлов: {selectedFiles.arrNum.length} </Text>;
		} else {
			if (this.props.files.length) {
				viewNumSelectFiles = <Text style={styles.selectFiles}>
					всего файлов: {files.length}</Text>;
			} else {
				viewNumSelectFiles = null;
			}
		}

		return (
			<Container style={styles.container}>
				<Headers title="Документы" goBack={() => goBack()} />
				<View style={styles.sign_enc_view}>
					<Text style={styles.sign_enc_title}>Файлы</Text>
					{viewNumSelectFiles}
				</View>
				{filesView}
				<Button
					transparent
					style={{ position: "absolute", bottom: 80, right: 30 }}
					onPressIn={() => this.documentPicker()}>
					<Image
						style={{ width: 60, height: 60 }}
						source={require("../../imgs/general/add_icon.png")} />
				</Button>
				{selectedFiles.arrNum.length
					? <FooterDoc
						files={files}
						selectedFiles={selectedFiles}
						clearselectedFiles={() => this.clearselectedFiles()}
						navigate={(page, cert) => navigate(page, { cert: cert })} />
					: null
				}
			</Container>
		);
	}
}