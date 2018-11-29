import * as React from "react";
import { Container, View, List, Button, Text, Content, Header, Spinner, Title, Footer, FooterTab } from "native-base";
import { Image, Linking } from "react-native";
import { Headers } from "../components/Headers";
import { styles } from "../styles";
import { ListMenu } from "../components/ListMenu";
import { FooterButton } from "../components/FooterButton";
import { iconSelection } from "../utils/forListFiles";
import { readCertKeys } from "../actions/certKeysAction";
import * as Modal from "react-native-modalbox";
import { ListWithModalDropdown } from "../components/ListWithModalDropdown";
import { ListWithSwitch } from "../components/ListWithSwitch";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { checkFiles } from "../actions";
import { verifySign, getSignInfo, signFile } from "../actions/funcForSignPageAction";

function mapStateToProps(state) {
	return {
		personalCert: state.personalCert,
		files: state.workspaceSign.files,
		isFetching: state.files.isFetchingSign,
		tempFiles: state.tempFiles.tempFiles
	};
}

function mapDispatchToProps(dispatch) {
	return {
		readCertKeys: bindActionCreators(readCertKeys, dispatch),
		checkFiles: bindActionCreators(checkFiles, dispatch),
		verifySign: bindActionCreators(verifySign, dispatch),
		getSignInfo: bindActionCreators(getSignInfo, dispatch),
		signFile: bindActionCreators(signFile, dispatch)
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
		version: any
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
	tempFiles: any;
	verifySign?(path: string, filename: string, itsCryptoArmDocuments: boolean): void;
	signFile(tempFiles, personalCert, signature, detached, isSuccessUpload): void;
	readCertKeys(): void;
	getSignInfo(path, navigate): void;
	checkFiles(res: object, workspace: string): void;
}

interface SignatureState {
	signature: string;
	detached: boolean;
	modalSign: boolean;
	isSuccess: Array<boolean>;
	href: string;
	chrome: string;
	modalWarning: boolean;
	documents_viewed: boolean;
}

const options = {
	year: "numeric", month: "long", day: "numeric",
	hour: "numeric", minute: "numeric", second: "numeric"
};

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class SignForCryptoArmDoc extends React.Component<SignatureProps, SignatureState> {

	constructor(props) {
		super(props);
		this.state = {
			signature: "BASE-64",
			detached: false,
			modalSign: false,
			isSuccess: [],
			modalWarning: false,
			href: "",
			chrome: "",
			documents_viewed: false
		};
	}

	showList(img) {
		return (
			this.props.tempFiles.arrFiles.map((file, key) =>
				<ListMenu
					key={key + file.id}
					title={file.filename}
					note={new Date(file.stat.mtime).toLocaleString("ru", options)}
					img={img[key]}
					checkbox
					active={true}
					nonClicked={true}
					nav={() => null} />
			));
	}

	private getFilesView(img) {
		return (
			<Content>
				{this.showList(img)}
			</Content>
		);
	}

	render() {
		const { readCertKeys, personalCert, isFetching, tempFiles, verifySign, getSignInfo, signFile } = this.props;
		const { navigate } = this.props.navigation;
		const img = iconSelection(tempFiles.arrFiles, tempFiles.arrFiles.length); // какое расширение у файлов
		const filesView = this.getFilesView(img);
		let loader = null;
		if (isFetching) {
			loader = <View style={styles.loader}>
				<View style={styles.loaderView}>
					<Spinner color={"#be3817"} />
					<Text style={{ fontSize: 17, color: "grey" }}>Операция{"\n"}выполняется</Text>
				</View>
			</View>;
		}
		let certificate;
		if (personalCert.cert.subjectFriendlyName) { // выбран ли сертификат
			certificate = <List>
				<ListMenu title={personalCert.cert.subjectFriendlyName} img={personalCert.img ? require("../../imgs/general/cert_ok_icon.png") : require("../../imgs/general/cert_bad_icon.png")}
					note={personalCert.cert.organizationName} nav={() => { readCertKeys(); navigate("SelectPersonalСert"); }} />
			</List>;
		} else {
			certificate = <View style={styles.sign_enc_view}>
				<Text onPress={() => { readCertKeys(); navigate("SelectPersonalСert"); }} style={styles.sign_enc_prompt}>[Добавьте сертификат подписчика]</Text>
			</View>;
		}

		let selectFilesView;
		if (tempFiles.arrFiles.length) { // выбраны ли файлы
			selectFilesView = <Text style={styles.selectFiles}>
				выбрано файлов: {tempFiles.arrFiles.length} </Text>;
		}
		return (
			<Container style={styles.container}>
				<Headers title="Подпись" />
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
				</View>
				{filesView}
				{loader}
				<Modal
					isOpen={this.state.modalWarning}
					style={[styles.modal, {
						height: "auto",
						width: 300,
						backgroundColor: "white",
					}]}
					backdropPressToClose={false}
					position={"center"}
					swipeToClose={false}>
					<View style={{ width: "100%" }}>
						<Header
							style={{ backgroundColor: "#be3817", height: 45.7, paddingTop: 13 }}>
							<Title>
								<Text style={{
									color: "white",
									fontSize: 15
								}}>Подтверждение операции</Text>
							</Title>
						</Header>
						<Text style={{ fontSize: 17, padding: 5 }}>
							{
								this.state.isSuccess.every(status => {
									return status === true;
								})
									? "Файл успешно подписан и отправлен. Подтвердите операцию перехода на сторонний ресурс"
									: "Ошибка при выполнении операции. Повторите операцию на сторонний ресурсе. Подтвердите операцию перехода на сторонний ресурс"
							}
						</Text>
						<View>
							<Button transparent style={[styles.modalMain, { width: "100%" }]} onPress={() => {
								this.setState({ modalWarning: false });
								if (this.state.chrome === "chrome") {
									Linking.openURL("googlechrome://");
								} else {
									Linking.openURL(this.state.href);
								}
								navigate("Main");
							}}>
								<Text style={styles.buttonModal}>Подтверить</Text>
							</Button>
						</View>
					</View>
				</Modal>
				<Modal
					isOpen={this.state.modalSign}
					style={[styles.modal, {
						height: "auto",
						width: 300,
						backgroundColor: "white",
					}]}
					position={"center"}
					swipeToClose={false}>
					<View style={{ width: "100%" }}>
						<Header
							style={{ backgroundColor: "#be3817", height: 45.7, paddingTop: 13 }}>
							<Title>
								<Text style={{
									color: "white",
									fontSize: 15
								}}>Настройка подписи</Text>
							</Title>
						</Header>
						<ListWithModalDropdown text="Кодировка"
							defaultValue={this.state.signature}
							changeValue={(value) => this.setState({ signature: value })}
							options={[{ value: "BASE-64" }, { value: "DER" }]} />
						<ListWithSwitch text="Сохранить подпись отдельно"
							value={this.state.detached}
							disabled={true}
							changeValue={() => this.setState({ detached: !this.state.detached })} />
						<ListWithSwitch text="Документы просмотрены перед их подписанием"
							value={this.state.documents_viewed}
							changeValue={() => this.setState({ documents_viewed: !this.state.documents_viewed })} />
						<View style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap", justifyContent: "space-around", maxWidth: "100%" }}>
							<Button transparent style={styles.modalMain} onPress={() => this.setState({ modalSign: false })}>
								<Text style={{ fontSize: 15, textAlign: "center", color: "black" }}>Отмена</Text>
							</Button>
							<Button transparent disabled={!this.state.documents_viewed} style={styles.modalMain} onPress={() => { this.setState({ modalSign: false }); signFile(tempFiles, personalCert, this.state.signature, this.state.detached, (isSuccess, browser, href) => { this.setState({ isSuccess, href, chrome: browser, modalWarning: true }); }); }}>
								<Text style={[{ fontSize: 15, textAlign: "center" }, this.state.documents_viewed ? { color: "black" } : null]}>Применить</Text>
							</Button>
						</View>
					</View>
				</Modal>
				{!isFetching
					? <Footer>
						<FooterTab>
							<FooterButton title="Проверить"
								disabled={tempFiles.footerMark === 1 || tempFiles.footerMark === 4}
								img={require("../../imgs/ios/verify_sign.png")}
								nav={() => {
									tempFiles.arrFiles.map(
										file => {
											verifySign(file.stat.path, file.realname, true);
										}
									);
								}} />
							<FooterButton title="Подписать"
								disabled={!personalCert.cert.subjectFriendlyName}
								img={require("../../imgs/ios/sign.png")}
								nav={() => {
									if (tempFiles.footerMark === 4) {
										this.setState({ modalSign: true });
									} else {
										signFile(tempFiles, personalCert, this.state.signature, this.state.detached, (isSuccess, browser, href) => { this.setState({ isSuccess, href, chrome: browser, modalWarning: true }); });
									}
								}} />
							<FooterButton title="Свойства"
								disabled={tempFiles.footerMark !== 3}
								img={require("../../imgs/ios/view_sign.png")}
								nav={() => {
									tempFiles.arrFiles.map(
										file => {
											getSignInfo(file.stat.path, navigate);
										}
									);
								}} />
							<FooterButton title="Отказаться" icon="ios-more" nav={() => navigate("Main")} />
						</FooterTab>
					</Footer>
					: null
				}
			</Container>
		);
	}
}