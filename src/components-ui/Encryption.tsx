import * as React from "react";
import { Container, View, List, Button, Text } from "native-base";
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
		files: state.files.files,
		otherCert: state.otherCert,
		isFetching: state.files.isFetching,
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
	isFetching: boolean;
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
		this.showListFiles = this.showListFiles.bind(this);
		this.showListEncCertificates = this.showListEncCertificates.bind(this);
		this.documentPicker = this.documentPicker.bind(this);
	}

	showListEncCertificates() {
		return (
			this.props.otherCert.arrEncCertificates.map((cert, key) => <ListMenu
				key={key}
				title= {cert.subjectFriendlyName}
				img={cert.chainBuilding ? require("../../imgs/general/cert2_ok_icon.png") : require("../../imgs/general/cert2_bad_icon.png")}
				note={cert.organizationName}
				nav={() => null}
				/>));
	}

	showListFiles(img) {
		return (
			this.props.files.map((file, key) => <ListMenu
				key={key + file.time}
				title={file.name}
				note={file.date + " " + file.month + " " + file.year + ", " + file.time}
				img={img[key]}
				checkbox
				nav={() => this.props.footerAction(key, file.extension)} />));
	}

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
	}

	render() {
		const { footerAction, footerClose, files, readFiles, readCertKeys, otherCert, isFetching } = this.props;
		const { navigate, goBack } = this.props.navigation;

		let certificate, filesView;
		if (otherCert.arrEncCertificates.length) { // выбран ли сертификат
			certificate = <List>
				{this.showListEncCertificates()}
			</List>;
		} else {
			certificate = <View style={styles.sign_enc_view}>
				<Text onPress={() => { readCertKeys(); navigate("SelectCert"); }} style={styles.sign_enc_prompt}>[Добавьте сертификаты получателей]</Text>
			</View>;
		}

		let img = iconSelection(files, files.length); // какое расширение у файлов

		if (files.length) {
			filesView = <ScrollView refreshControl={
				<RefreshControl refreshing={isFetching}
					onRefresh={() => readFiles()} />}>
				<List>{this.showListFiles(img)}</List>
			</ScrollView>;
		} else {
			filesView = <View style={styles.sign_enc_view}>
				<Text style={styles.sign_enc_prompt} onPress={() => { this.documentPicker(); }}>[Добавьте файлы]</Text>
			</View>;
		}

		let footer, selectFiles = null;
		if (this.props.footer.arrButton.length) { // выбраны ли файлы
			footer = <FooterEnc />;
			selectFiles = <Text style={{ fontSize: 17, height: 20, color: "grey", paddingLeft: 4 }}>
				выбрано файлов: {this.props.footer.arrButton.length}</Text>;
		} else {
			if (files.length) {
				selectFiles = <Text style={{ fontSize: 17, height: 20, color: "grey", width: "70%", paddingLeft: 4 }}>
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
				{certificate}
				<View style={styles.sign_enc_view}>
					<Text style={styles.sign_enc_title}>Файлы</Text>
					{selectFiles}
					<Button transparent style={styles.sign_enc_button} onPress={() => { this.documentPicker(); }}>
						<Image style={styles.headerImage} source={require("../../imgs/general/add_icon.png")} />
					</Button>
				</View>
				{filesView}
				{footer}
			</Container>
		);
	}

	componentDidMount() {
		this.props.footerClose();
	}
}