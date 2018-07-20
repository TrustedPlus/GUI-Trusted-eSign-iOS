import * as React from "react";
import { Container, View, List, Button, Text, Content } from "native-base";
import { Image, RefreshControl, ScrollView, Alert } from "react-native";
import { Headers } from "../components/Headers";
import { styles } from "../styles";
import { ListMenu } from "../components/ListMenu";
import { FooterEnc } from "./FooterEnc";
import { iconSelection } from "../utils/forListFiles";
import { readCertKeys } from "../actions/certKeysAction";
import { DocumentPicker } from "react-native-document-picker";
import { showToast } from "../utils/toast";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { /*footerAction, footerClose,*/ readFiles, addFiles } from "../actions/index";

function mapStateToProps(state) {
	return {
		files: state.workspaceEnc.files,
		otherCert: state.otherCert
	};
}

function mapDispatchToProps(dispatch) {
	return {
		/*footerAction: bindActionCreators(footerAction, dispatch),
		footerClose: bindActionCreators(footerClose, dispatch),*/
		readCertKeys: bindActionCreators(readCertKeys, dispatch),
		addFiles: bindActionCreators(addFiles, dispatch)
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

interface EncryptionProps {
	navigation: any;
	otherCert: any;
	files: IFile[];
	/*footerAction(key: number, extension: string): void;
	footerClose(): void;*/
	readCertKeys(): void;
	addFiles(uri: string, fileName: string): void;
}

interface ISelectedFiles {
	arrNum: Array<number>;
	arrExtension: Array<string>;
}

interface EncryptionState {
	selectedFiles?: ISelectedFiles;
	activeFiles?: boolean;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class Encryption extends React.Component<EncryptionProps, EncryptionState> {

	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
		this.state = {
			selectedFiles: {
				arrNum: this.props.navigation.state.params.selectedFiles ? this.props.navigation.state.params.selectedFiles.arrNum : [],
				arrExtension: this.props.navigation.state.params.selectedFiles ? this.props.navigation.state.params.selectedFiles.arrExtension : [],
			},
			activeFiles: this.props.navigation.state.params.selectedFiles ? true : false
		};
		this.props.navigation.state.key = "Home";
	}

	showListEncCertificates() {
		return (
			this.props.otherCert.arrEncCertificates.map((cert, key) => <ListMenu
				key={key}
				title={cert.subjectFriendlyName}
				img={cert.chainBuilding ? require("../../imgs/general/cert2_ok_icon.png") : require("../../imgs/general/cert2_bad_icon.png")}
				note={cert.organizationName}
				nav={() => null}
			/>));
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

	showListFiles(img) {
		return (
			this.props.files.map((file, key) => <ListMenu
				key={key + file.time}
				title={file.name}
				note={file.date + " " + file.month + " " + file.year + ", " + file.time}
				img={img[key]}
				checkbox
				active={this.state.activeFiles ? true : false}
				nav={() => {
					const newSelectedFiles = this.changeSelectedRequests(this.state.selectedFiles, key, file.extension);
					this.setState({ selectedFiles: { arrNum: newSelectedFiles.arrNum, arrExtension: newSelectedFiles.arrExtension } });
				}/*this.props.footerAction(key, file.extension)*/} />));
	}
	/*
		documentPicker() {
			DocumentPicker.show({
				filetype: ["public.item"]
			}, (error: any, res: any) => {
				if (error) {
					showToast(error);
				} else {
					this.props.addFiles(res.uri, res.fileName);
				}
			});
		} */

	clearselectedFiles() {
		this.setState({
			selectedFiles: {
				arrNum: [],
				arrExtension: []
			}
		});
	}

	private getFilesView(files, img) {
		if (files.length) {
			return (
				<Content>
					<List>{this.showListFiles(img)}</List>
				</Content>
			);
		}

		return (
			<View style={styles.sign_enc_view}>
				<Text
					style={styles.sign_enc_prompt}
					onPress={() => this.props.navigation.navigate("Documents")}>[Добавьте файлы]</Text>
			</View>
		);
	}

	render() {
		const { files, readCertKeys, otherCert } = this.props;
		const { navigate, goBack } = this.props.navigation;

		let certificate;
		if (otherCert.arrEncCertificates.length) { // выбран ли сертификат
			certificate = <ScrollView alwaysBounceVertical={true} style={{ maxHeight: 150 }}><List>
				{this.showListEncCertificates()}
			</List>
			</ScrollView>;
		} else {
			certificate = <View style={styles.sign_enc_view}>
				<Text onPress={() => { readCertKeys(); navigate("SelectCert"); }} style={styles.sign_enc_prompt}>[Добавьте сертификаты получателей]</Text>
			</View>;
		}

		let img = iconSelection(files, files.length); // какое расширение у файлов

		const filesView = this.getFilesView(files, img);

		let selectFilesView = null;
		if (this.state.selectedFiles.arrNum.length) { // выбраны ли файлы
			selectFilesView = <Text style={styles.selectFiles}>
				выбрано файлов: {this.state.selectedFiles.arrNum.length}</Text>;
		} else {
			if (files.length) {
				selectFilesView = <Text style={styles.selectFiles}>
					всего файлов: {files.length}</Text>;
			} else {
				selectFilesView = null;
			}
		}
		return (
			<Container style={styles.container}>
				<Headers title="Шифрование / Расшифрование" goBack={() => goBack()} />
				<View style={styles.sign_enc_view}>
					<Text style={styles.sign_enc_title}>Сертификаты получателей</Text>
					<Button transparent style={styles.sign_enc_button} onPressIn={() => { readCertKeys(); navigate("SelectCert"); }}>
						<Image style={styles.headerImage} source={require("../../imgs/general/add_icon.png")} />
					</Button>
				</View>
				<View>
					{certificate}
				</View>
				<View style={styles.sign_enc_view}>
					<Text style={styles.sign_enc_title}>Файлы</Text>
					{selectFilesView}
					<Button transparent style={styles.sign_enc_button} onPressIn={() => navigate("Documents")}>
						<Image style={styles.headerImage} source={require("../../imgs/general/add_icon.png")} />
					</Button>
				</View>
				{filesView}
				{this.state.selectedFiles.arrNum.length
					? <FooterEnc
						files={files}
						otherCert={otherCert}
						footer={{ arrButton: this.state.selectedFiles.arrNum, arrExtension: this.state.selectedFiles.arrExtension }}
						clearselectedFiles={() => this.clearselectedFiles()} />
					: null}
			</Container>
		);
	}

	componentDidMount() {
		this.setState({ activeFiles: false });
	}
}