import * as React from "react";
import * as RNFS from "react-native-fs";
import { styles } from "../styles";
import { showToastDanger } from "../utils/toast";
import { Headers } from "../components/Headers";
import { Container, List, Text, View, Button, Content, Spinner } from "native-base";
import { Image, RefreshControl, ScrollView, NativeModules } from "react-native";
import { ListMenu } from "../components/ListMenu";
import { iconSelection } from "../utils/forListFiles";
import { FooterDoc } from "./FooterDoc";
import DocumentPicker from "react-native-document-picker";
import { AddCertButton } from "../components/AddCertButton";
import { Loader } from "../components/Loader";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { readFiles, checkFiles } from "../actions";

function mapStateToProps(state) {
	return {
		files: state.files.files,
		isFetching: state.files.isFetching
	};
}

function mapDispatchToProps(dispatch) {
	return {
		readFiles: bindActionCreators(readFiles, dispatch),
		checkFiles: bindActionCreators(checkFiles, dispatch)
	};
}

interface ISelectedFiles {
	arrNum: Array<number>;
	arrExtension: Array<string>;
}

interface IFile {
	mtime: Date;
	extension: string;
	extensionAll: string;
	name: string;
	verify: number;
}

interface DocumentsProps {
	navigation: any;
	goBack: void;
	files: IFile[];
	isFetching: boolean;
	readFiles(): void;
	checkFiles(res: object, workspace: string, refreshDoc: Function): void;
}

interface DocumentsState {
	selectedFiles?: ISelectedFiles;
	loadingDocuments?: boolean;
}

const options = {
	year: "numeric", month: "long", day: "numeric",
	hour: "numeric", minute: "numeric", second: "numeric"
};

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class Documents extends React.Component<DocumentsProps, DocumentsState> {

	constructor(props) {
		super(props);

		this.state = {
			selectedFiles: {
				arrNum: [],
				arrExtension: []
			},
			loadingDocuments: false
		};
	}

	syncDocuments() {
		this.setState({
			selectedFiles: {
				arrNum: [],
				arrExtension: []
			}
		});
		NativeModules.Wrap_Main.loadToICloud(RNFS.DocumentDirectoryPath, (veify, err) => {
			if (veify === "iCloud container not available.") {
				showToastDanger("Ошибка доступа к iCloud");
			} else {
				RNFS.readDir("/var/mobile/Library/Mobile Documents/iCloud~com~digt~CryptoARMGOCTDocuments/Documents/").then(
					fileForCloud => {
						console.log(fileForCloud);
						for (let i = 0; i < fileForCloud.length; i++) {
							if (fileForCloud[i].name.indexOf(".icloud") !== -1) {
								NativeModules.Wrap_Main.downloadingFileFromiCloud(fileForCloud[i].path, (veify, err) => {
									RNFS.readDir("/var/mobile/Library/Mobile Documents/iCloud~com~digt~CryptoARMGOCTDocuments/Documents/").then(
										newFileForCloud => console.log(newFileForCloud)
									);
									let correctName = fileForCloud[i].name;
									correctName = correctName.replace(".icloud", "");
									correctName = correctName.slice(1);
									RNFS.copyFile("/var/mobile/Library/Mobile Documents/iCloud~com~digt~CryptoARMGOCTDocuments/Documents/" + correctName, RNFS.DocumentDirectoryPath + "/Files/" + correctName).then(
										() => {
											if (i + 1 === fileForCloud.length) {
												this.props.readFiles();
											}
										}
									);
								});
							} else if (fileForCloud[i].name[0] === ".") {
								continue;
							} else {
								RNFS.copyFile("/var/mobile/Library/Mobile Documents/iCloud~com~digt~CryptoARMGOCTDocuments/Documents/" + fileForCloud[i].name, RNFS.DocumentDirectoryPath + "/Files/" + fileForCloud[i].name).then(
									success => {
										if (i + 1 === fileForCloud.length) {
											this.props.readFiles();
										}
									},
									err => {
										RNFS.unlink(RNFS.DocumentDirectoryPath + "/Files/" + fileForCloud[i].name).then(
											() => RNFS.copyFile("/var/mobile/Library/Mobile Documents/iCloud~com~digt~CryptoARMGOCTDocuments/Documents/" + fileForCloud[i].name, RNFS.DocumentDirectoryPath + "/Files/" + fileForCloud[i].name).then(
												() => {
													if (i + 1 === fileForCloud.length) {
														this.props.readFiles();
													}
												}
											)
										);
									}
								);
							}
						}
						RNFS.readDir(RNFS.DocumentDirectoryPath + "/Files/").then(
							fileForApps => {
								for (let i = 0; i < fileForApps.length; i++) {
									if (fileForApps[i].name[0] === ".") {
										continue;
									}
									console.log(fileForApps[i]);
									RNFS.copyFile(fileForApps[i].path, "/var/mobile/Library/Mobile Documents/iCloud~com~digt~CryptoARMGOCTDocuments/Documents/" + fileForApps[i].name).then(
										success => {
											console.log(success);
										},
										err => {
											RNFS.unlink("/var/mobile/Library/Mobile Documents/iCloud~com~digt~CryptoARMGOCTDocuments/Documents/" + fileForApps[i].name)
												.then(() => {
													RNFS.copyFile(fileForApps[i].path, "/var/mobile/Library/Mobile Documents/iCloud~com~digt~CryptoARMGOCTDocuments/Documents/" + fileForApps[i].name);
												})
												.catch((err) => {
													console.log(err.message);
												});
										}
									);
								}
							}
						);
					},
					err => {
						console.log(err);
					}
				);
			}
		});
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
				key={key + new Date(file.mtime).toLocaleString("ru", options)}
				title={file.name + (file.extensionAll === "" ? "" : "." + file.extensionAll)}
				note={new Date(file.mtime).toLocaleString("ru", options)}
				checkbox
				img={img[key]}
				nav={() => {
					const newSelectedFiles = this.changeSelectedRequests(this.state.selectedFiles, key, file.extension);
					this.setState({ selectedFiles: { arrNum: newSelectedFiles.arrNum, arrExtension: newSelectedFiles.arrExtension } });
				}} />));
	}

	documentPicker() {
		DocumentPicker.pickMultiple({
			type: ["public.item"]
		}).then((res) => {
			this.props.checkFiles(res, null, () => {
				this.setState({
					selectedFiles: {
						arrNum: [],
						arrExtension: []
					}
				});
			});
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
				<ScrollView /*refreshControl={
					<RefreshControl
						refreshing={isFetching}
						onRefresh={() => {
							readFiles();
							this.clearselectedFiles();
						}} />}*/>
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
				<Headers title="Документы"
					type="MaterialCommunityIcons"
					iconRight={"cloud-sync"}
					goRight={() => this.syncDocuments()}
					goBack={() => goBack()} />
				{this.state.loadingDocuments ? <>
					<View style={styles.sign_enc_view}>
						<Text style={styles.sign_enc_title}>Файлы</Text>
						{viewNumSelectFiles}
					</View>
					{filesView}
					<Loader isFetching={isFetching}/>
					{isFetching
						? null
						: <Button
							transparent
							style={{ position: "absolute", bottom: 80, right: 30 }}
							onPressIn={() => this.documentPicker()}>
							<Image
								style={{ width: 60, height: 60 }}
								source={require("../../imgs/general/add_icon.png")} />
						</Button>}
					{selectedFiles.arrNum.length && !isFetching
						? <FooterDoc
							files={files}
							selectedFiles={selectedFiles}
							clearselectedFiles={() => this.clearselectedFiles()}
							navigate={navigate} />
						: null
					}</> : <View style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: "90%",
						backgroundColor: "white"
					}}>
						<Spinner color={"#be3817"} />
					</View>}
			</Container>
		);
	}

	componentDidMount() {
		setTimeout(
			() => this.setState({ loadingDocuments: true }), 1
		);
	}
}