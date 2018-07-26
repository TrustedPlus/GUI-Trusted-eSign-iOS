import * as React from "react";
import { Container, View, List, Button, Text, Content } from "native-base";
import { Image, RefreshControl, ScrollView } from "react-native";
import { Headers } from "../components/Headers";
import { styles } from "../styles";
import { ListMenu } from "../components/ListMenu";
import { FooterSign } from "./FooterSign";
import { iconSelection } from "../utils/forListFiles";
import { readCertKeys } from "../actions/certKeysAction";
import { DocumentPicker } from "react-native-document-picker";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addFiles } from "../actions";

function mapStateToProps(state) {
	return {
		personalCert: state.personalCert,
		files: state.workspaceSign.files
	};
}

function mapDispatchToProps(dispatch) {
	return {
		readCertKeys: bindActionCreators(readCertKeys, dispatch),
		addFiles: bindActionCreators(addFiles, dispatch)
	};
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

interface SignatureProps {
	navigation: any;
	personalCert: any;
	files: IFile[];
	readCertKeys(): void;
	addFiles(uri: string, fileName: string): void;
}

interface ISelectedFiles {
	arrNum: Array<number>;
	arrExtension: Array<string>;
}

interface SignatureState {
	selectedFiles?: ISelectedFiles;
	activeFiles?: boolean;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class Signature extends React.Component<SignatureProps, SignatureState> {

	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
		this.state = {
			selectedFiles: {
				arrNum: this.props.navigation.state.params.cert ? this.props.navigation.state.params.cert.selectedFiles.arrNum : [],
				arrExtension: this.props.navigation.state.params.cert ? this.props.navigation.state.params.cert.selectedFiles.arrExtension : [],
			},
			activeFiles: this.props.navigation.state.params.cert ? true : false
		};
		this.props.navigation.state.key = "HomeSign";
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

	clearselectedFiles() {
		this.setState({
			selectedFiles: {
				arrNum: [],
				arrExtension: []
			}
		});
	}

	showList(img) {
		return (
			this.props.files.map((file, key) => <ListMenu
				key={key + file.time}
				title={file.name + "." + file.extensionAll}
				note={file.date + " " + file.month + " " + file.year + ", " + file.time}
				verify={file.verify}
				img={img[key]}
				checkbox
				active={this.state.activeFiles ? true : false}
				nav={() => {
					const newSelectedFiles = this.changeSelectedRequests(this.state.selectedFiles, key, file.extension);
					this.setState({ selectedFiles: { arrNum: newSelectedFiles.arrNum, arrExtension: newSelectedFiles.arrExtension } });
				}} />));
	}
	/*
		documentPicker() {
			DocumentPicker.show({
				filetype: ["public.item"]
			}, (error: any, res: any) => {
				this.props.addFiles(res.uri, res.fileName);
			});
		} */

	private getFilesView(files, img) {
		if (files.length) {
			return (
				<Content>
					<List>{this.showList(img)}</List>
				</Content>
			);
		}

		return (
			<View style={styles.sign_enc_view}>
				<Text
					style={styles.sign_enc_prompt}
					onPress={() => this.props.navigation.navigate("NotSelectedDocuments", { from: "sign" }) }>[Добавьте файлы]</Text>
			</View>
		);
	}

	render() {
		const { files, readCertKeys, personalCert } = this.props;
		const { navigate, goBack } = this.props.navigation;

		const img = iconSelection(files, files.length); // какое расширение у файлов
		const filesView = this.getFilesView(files, img);

		let certificate;
		if (personalCert.title) { // выбран ли сертификат
			certificate = <List>
				<ListMenu title={personalCert.title} img={personalCert.img}
					note={personalCert.note} nav={() => { readCertKeys(); navigate("SelectPersonalСert"); }} />
			</List>;
		} else {
			certificate = <View style={styles.sign_enc_view}>
				<Text onPress={() => { readCertKeys(); navigate("SelectPersonalСert"); }} style={styles.sign_enc_prompt}>[Добавьте сертификат подписчика]</Text>
			</View>;
		}

		let selectFilesView;
		if (this.state.selectedFiles.arrNum.length) { // выбраны ли файлы
			selectFilesView = <Text style={styles.selectFiles}>
				выбрано файлов: {this.state.selectedFiles.arrNum.length} </Text>;
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
				<Headers title="Подпись / Проверка" goBack={() => goBack()} />
				<View style={styles.sign_enc_view}>
					<Text style={styles.sign_enc_title}>Сертификат подписи</Text>
					<Button transparent onPressIn={() => { readCertKeys(); navigate("SelectPersonalСert", { isCertInContainers: true }); }} style={styles.sign_enc_button}>
						<Image style={styles.headerImage} source={require("../../imgs/general/add_icon.png")} />
					</Button>
				</View>
				{certificate}
				<View style={styles.sign_enc_view}>
					<Text style={styles.sign_enc_title}>Файлы</Text>
					{selectFilesView}
					<Button transparent style={styles.sign_enc_button} onPressIn={() => navigate("NotSelectedDocuments", { from: "sign" })}>
						<Image style={styles.headerImage} source={require("../../imgs/general/add_icon.png")} />
					</Button>
				</View>
				{filesView}
				{this.state.selectedFiles.arrNum.length
					? <FooterSign
						files={files}
						personalCert={personalCert}
						footer={{ arrButton: this.state.selectedFiles.arrNum, arrExtension: this.state.selectedFiles.arrExtension }}
						navigate={(page, cert) => navigate(page, { cert: cert })}
						clearselectedFiles={() => this.clearselectedFiles()} />
					: null}
			</Container>
		);
	}

	componentDidMount() {
		this.setState({ activeFiles: false });
	}
}