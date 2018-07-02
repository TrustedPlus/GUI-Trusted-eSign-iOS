import * as React from "react";
import { Container, View, List, Button, Text } from "native-base";
import { Image, RefreshControl, ScrollView } from "react-native";
import { Headers } from "../components/Headers";
import { styles } from "../styles";
import { ListMenu } from "../components/ListMenu";
import { FooterSign } from "./FooterSign";
import { iconSelection } from "../utils/forListFiles";
import { showToast } from "../utils/toast";
import { readCertKeys } from "../actions/certKeysAction";
import { DocumentPicker } from "react-native-document-picker";
import * as Modal from "react-native-modalbox";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { footerAction, footerClose, readFiles, addFiles } from "../actions/index";

function mapStateToProps(state) {
	return {
		footer: state.footer,
		personalCert: state.personalCert,
		files: state.files.files,
		isFetching: state.files.isFetching
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

interface SignatureProps {
	navigation: any;
	footer: any;
	personalCert: any;
	files: IFile[];
	isFetching: boolean;
	footerAction(key: number, extension: string): void;
	footerClose(): void;
	readFiles(): void;
	readCertKeys(): void;
	addFiles(uri: string, fileName: string): void;
}
/*
interface IModals {
	basicModal: Modal.default;
}*/

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class Signature extends React.Component<SignatureProps> {

	static navigationOptions = {
		header: null
	};

	/*private modals: IModals = {
		basicModal: null
	};*/

	constructor(props) {
		super(props);

		this.props.navigation.state.key = "Home";
		this.showList = this.showList.bind(this);
		this.documentPicker = this.documentPicker.bind(this);
	}

	showList(img) {
		return (
			this.props.files.map((file, key) => <ListMenu
				key={key + file.time}
				title={file.name}
				note={file.date + " " + file.month + " " + file.year + ", " + file.time}
				verify={file.verify}
				img={img[key]}
				checkbox
				nav={() => this.props.footerAction(key, file.extension)} />));
	}

	documentPicker() {
		DocumentPicker.show({
			filetype: ["public.item"]
		}, (error: any, res: any) => {
			this.props.addFiles(res.uri, res.fileName);
		});
	}

	private getFilesView(files, isFetching, img, readFiles) {
		if (files.length) {
			return (
				<ScrollView refreshControl={
					<RefreshControl
						refreshing={isFetching}
						onRefresh={() => readFiles()} />}>
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
		const { footerAction, footerClose, footer, files, isFetching, readFiles, readCertKeys, personalCert } = this.props;
		const { navigate, goBack } = this.props.navigation;

		let certificate;

		let img = iconSelection(files, files.length); // какое расширение у файлов
		const filesView = this.getFilesView(files, isFetching, img, readFiles);
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

		let selectFiles = null;
		if (footer.arrButton.length) { // выбраны ли файлы
			selectFiles = <Text style={styles.selectFiles}>
				выбрано файлов: {footer.arrButton.length} </Text>;
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
				<Headers title="Подпись / Проверка" goBack={() => goBack()} />
				<View style={styles.sign_enc_view}>
					<Text style={styles.sign_enc_title}>Сертификат подписи</Text>
					<Button transparent onPress={() => { readCertKeys(); navigate("SelectPersonalСert", { isCertInContainers: true }); }} style={styles.sign_enc_button}>
						<Image style={styles.headerImage} source={require("../../imgs/general/add_icon.png")} />
					</Button>
				</View>
				{certificate}
				<View style={styles.sign_enc_view}>
					<Text style={styles.sign_enc_title}>Файлы</Text>
					{selectFiles}
					<Button transparent style={styles.sign_enc_button} onPress={() => this.documentPicker()}>
						<Image style={styles.headerImage} source={require("../../imgs/general/add_icon.png")} />
					</Button>
				</View>
				{filesView}
				{footer.arrButton.length ? <FooterSign files={files} personalCert={personalCert} footer={footer}/> : null}
			</Container>
		);
	}

	componentDidMount() {
		this.props.footerClose();
	}
}