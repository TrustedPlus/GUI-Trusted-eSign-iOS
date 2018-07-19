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
import { footerAction, footerClose, readFiles, addFiles } from "../actions/index";

function mapStateToProps(state) {
	return {
		footer: state.footer,
		files: state.workspaceEnc.files,
		otherCert: state.otherCert,
		certificates: state.certificates.certificates
	};
}

function mapDispatchToProps(dispatch) {
	return {
		footerAction: bindActionCreators(footerAction, dispatch),
		footerClose: bindActionCreators(footerClose, dispatch),
		readFiles: bindActionCreators(readFiles, dispatch),
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
	footer: any;
	otherCert: any;
	files: IFile[];
	certificates: any;
	footerAction(key: number, extension: string): void;
	footerClose(): void;
	readFiles(): void;
	readCertKeys(): void;
	addFiles(uri: string, fileName: string): void;
}
@(connect(mapStateToProps, mapDispatchToProps) as any)
export class Encryption extends React.Component<EncryptionProps> {

	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);

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

	showListFiles(img) {
		const { selectedFiles } = this.props.navigation.state.params;
		return (
			this.props.files.map((file, key) => <ListMenu
				key={key + file.time}
				title={file.name}
				note={file.date + " " + file.month + " " + file.year + ", " + file.time}
				img={img[key]}
				checkbox
				active={selectedFiles ? true : false}
				nav={() => this.props.footerAction(key, file.extension)} />));
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

	private getFilesView(files, img, readFiles) {
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
		const { files, footer, readFiles, readCertKeys, otherCert } = this.props;
		const { navigate, goBack } = this.props.navigation;
		const { selectedFiles } = this.props.navigation.state.params;

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

		const filesView = this.getFilesView(files, img, readFiles);

		let selectFiles = null;
		if (footer.arrButton.length) { // выбраны ли файлы
			selectFiles = <Text style={styles.selectFiles}>
				выбрано файлов: {footer.arrButton.length}</Text>;
		} else {
			if (files.length) {
				selectFiles = <Text style={styles.selectFiles}>
					всего файлов: {files.length}</Text>;
			} else {
				selectFiles = null;
			}
		}
		return (
			<Container style={styles.container}>
				<Headers title="Шифрование / Расшифрование" goBack={() => goBack()} />
				<View style={styles.sign_enc_view}>
					<Text style={styles.sign_enc_title}>Сертификаты получателей</Text>
					<Button transparent style={styles.sign_enc_button} onPress={() => { readCertKeys(); navigate("SelectCert"); }}>
						<Image style={styles.headerImage} source={require("../../imgs/general/add_icon.png")} />
					</Button>
				</View>
				<View>
					{certificate}
				</View>
				<View style={styles.sign_enc_view}>
					<Text style={styles.sign_enc_title}>Файлы</Text>
					{selectFiles}
					<Button transparent style={styles.sign_enc_button} onPress={() => navigate("Documents")}>
						<Image style={styles.headerImage} source={require("../../imgs/general/add_icon.png")} />
					</Button>
				</View>
				{filesView}
				{footer.arrButton.length ? <FooterEnc files={files} otherCert={otherCert} footer={footer} /> : null}
			</Container>
		);
	}

	componentDidMount() {
		this.props.footerClose();
	}
}