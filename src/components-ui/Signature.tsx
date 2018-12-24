import * as React from "react";
import { Container, View, List, Button, Text, Content, Header, Spinner, Title, ListItem, Right, Icon, Left } from "native-base";
import { Image, RefreshControl, Linking, AlertIOS } from "react-native";
import { Headers } from "../components/Headers";
import { styles } from "../styles";
import { ListMenu } from "../components/ListMenu";
import { FooterSign } from "./FooterSign";
import { iconSelection } from "../utils/forListFiles";
import { readCertKeys } from "../actions/certKeysAction";
import DocumentPicker from "react-native-document-picker";
import * as Modal from "react-native-modalbox";
import { Loader } from "../components/Loader";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { checkFiles } from "../actions";

function mapStateToProps(state) {
	return {
		personalCert: state.personalCert,
		files: state.workspaceSign.files,
		isFetching: state.files.isFetchingSign
	};
}

function mapDispatchToProps(dispatch) {
	return {
		readCertKeys: bindActionCreators(readCertKeys, dispatch),
		checkFiles: bindActionCreators(checkFiles, dispatch)
	};
}

interface IPersonalCert {
	cert: {
		category: any,
		chainBuilding: any,
		hasPrivateKey: any,
		isCA: any,
		issuerFriendlyName: any,
		issuerName: any,
		keyUsage: any,
		notAfter: any,
		notBefore: any,
		organizationName: any,
		provider: any,
		publicKeyAlgorithm: any,
		selfSigned: any,
		serialNumber: any,
		signatureAlgorithm: any,
		signatureDigestAlgorithm: any,
		subjectFriendlyName: any,
		subjectName: any,
		type: any,
		version: any,
		transaction_id?: string
	};
	img: string;
}

interface IFile {
	mtime: Date;
	extension: string;
	extensionAll: string;
	name: string;
	verify: number;
}

interface SignatureProps {
	navigation: any;
	personalCert: IPersonalCert;
	files: IFile[];
	isFetching: boolean;
	readCertKeys(): void;
	checkFiles(res: object, workspace: string): void;
}

interface ISelectedFiles {
	arrNum: Array<number>;
	arrExtension: Array<string>;
}

interface SignatureState {
	selectedFiles?: ISelectedFiles;
	activeFiles?: boolean;
}

interface IModals {
	basicModal: Modal.default;
}

const options = {
	year: "numeric", month: "long", day: "numeric",
	hour: "numeric", minute: "numeric", second: "numeric"
};

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class Signature extends React.Component<SignatureProps, SignatureState> {

	private modals: IModals = {
		basicModal: null
	};

	constructor(props) {
		super(props);
		this.state = {
			selectedFiles: {
				arrNum: this.props.navigation.state.params.selectedFiles ? this.props.navigation.state.params.selectedFiles.arrNum : [],
				arrExtension: this.props.navigation.state.params.selectedFiles ? this.props.navigation.state.params.selectedFiles.arrExtension : [],
			},
			activeFiles: this.props.navigation.state.params.selectedFiles ? true : false,
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
				key={key + new Date(file.mtime).toLocaleString("ru", options)}
				title={file.name + (file.extensionAll === "" ? "" : "." + file.extensionAll)}
				note={new Date(file.mtime).toLocaleString("ru", options)}
				img={img[key]}
				checkbox
				active={this.state.activeFiles ? true : false}
				nav={() => {
					const newSelectedFiles = this.changeSelectedRequests(this.state.selectedFiles, key, file.extension);
					this.setState({ selectedFiles: { arrNum: newSelectedFiles.arrNum, arrExtension: newSelectedFiles.arrExtension } });
				}} />));
	}

	documentPicker() {
		DocumentPicker.pickMultiple({
			type: ["public.item"]
		}).then((res) => {
			this.props.checkFiles(res, "sign");
			this.modals.basicModal.close();
		}).catch((err) => {
			this.modals.basicModal.close();
		});
	}

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
					onPress={() => this.props.navigation.navigate("NotSelectedDocuments", { from: "sign" })}>[Добавьте файлы]</Text>
			</View>
		);
	}

	render() {
		const { files, readCertKeys, personalCert, isFetching } = this.props;
		const { navigate, goBack } = this.props.navigation;

		const img = iconSelection(files, files.length); // какое расширение у файлов
		const filesView = this.getFilesView(files, img);

		let certificate;
		if (personalCert.cert.subjectFriendlyName) { // выбран ли сертификат
			certificate =
				<List>
					<ListMenu title={personalCert.cert.subjectFriendlyName} img={(personalCert.img || personalCert.img === undefined) ? require("../../imgs/general/cert_ok_icon.png") : require("../../imgs/general/cert_bad_icon.png")}
						note={personalCert.cert.organizationName} rightimg={personalCert.cert.transaction_id ? require("../../imgs/general/megafon.png") : false} nav={() => { readCertKeys(); navigate("SelectPersonalСert"); }} />
				</List>;
		} else {
			certificate =
				<View style={styles.sign_enc_view}>
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
				<Headers title="Подпись" goBack={() => goBack()} />
				<View style={styles.sign_enc_view}>
					<Text style={styles.sign_enc_title}>Сертификат подписи</Text>
					<Button transparent onPressIn={() => { readCertKeys(); navigate("SelectPersonalСert", { isCertInContainers: true }); }} style={styles.sign_enc_button}>
						<Image style={styles.headerImage} source={personalCert.cert.hasPrivateKey ? require("../../imgs/general/change_cert.png") : require("../../imgs/general/add_icon.png")} />
					</Button>
				</View>
				{certificate}
				<View style={styles.sign_enc_view}>
					<Text style={styles.sign_enc_title}>Файлы</Text>
					{selectFilesView}
					{
						<Button transparent style={styles.sign_enc_button} onPressIn={() => this.modals.basicModal.open()}>
							<Image style={styles.headerImage} source={require("../../imgs/general/add_icon.png")} />
						</Button>
					}
				</View>
				{filesView}
				<Loader isFetching={isFetching}/>
				<Modal
					ref={ref => this.modals.basicModal = ref}
					style={styles.modal}
					position={"center"}
					swipeToClose={false}>
					<Header
						style={{ backgroundColor: "#be3817", height: 45.7, width: 300, paddingTop: 13 }}>
						<Title>
							<Text style={{
								color: "white",
								fontSize: 15
							}}>Добавление файла</Text>
						</Title>
					</Header>
					<View>
						<List>
							<ListItem last style={{ marginLeft: 0, paddingLeft: 17 }} onPress={() => { navigate("NotSelectedDocuments", { from: "sign" }); this.modals.basicModal.close(); }}>
								<Left>
									<Text style={{ fontSize: 14, color: "grey" }}>Из документов</Text>
								</Left>
								<Right>
									<Icon name="ios-arrow-forward-outline"></Icon>
								</Right>
							</ListItem>
							<ListItem last style={{ marginLeft: 0, paddingLeft: 17 }} onPress={() => this.documentPicker()} >
								<Left>
									<Text style={{ fontSize: 14, color: "grey" }}>Импортировать</Text>
								</Left>
								<Right>
									<Icon name="ios-arrow-forward-outline"></Icon>
								</Right>
							</ListItem>
							<ListItem onPress={() => this.modals.basicModal.close()}>
								<Text style={{ fontSize: 15, width: "100%", height: "100%", textAlign: "center", color: "grey" }}>Отмена</Text>
							</ListItem>
						</List>
					</View>
				</Modal>
				{this.state.selectedFiles.arrNum.length && !isFetching
					? <FooterSign
						files={files}
						personalCert={personalCert}
						footer={{ arrButton: this.state.selectedFiles.arrNum, arrExtension: this.state.selectedFiles.arrExtension }}
						navigate={navigate}
						clearselectedFiles={() => this.clearselectedFiles()} />
					: null}
			</Container>
		);
	}

	componentWillUpdate() {
		if (this.state.selectedFiles.arrNum !== (this.props.navigation.state.params.selectedFiles ? this.props.navigation.state.params.selectedFiles.arrNum : null)) {
			if (this.props.navigation.state.params.refreshSign) {
				this.setState({
					selectedFiles: {
						arrNum: this.props.navigation.state.params.selectedFiles ? this.props.navigation.state.params.selectedFiles.arrNum : [],
						arrExtension: this.props.navigation.state.params.selectedFiles ? this.props.navigation.state.params.selectedFiles.arrExtension : [],
					}
				});
			}
		}
		if (this.state.activeFiles) {
			this.setState({ activeFiles: false });
		}
	}
}