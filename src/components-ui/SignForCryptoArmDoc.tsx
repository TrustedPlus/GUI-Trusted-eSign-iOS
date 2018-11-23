import * as React from "react";
import { Container, View, List, Button, Text, Content, Header, Spinner, Title } from "native-base";
import { Image, Linking } from "react-native";
import { Headers } from "../components/Headers";
import { styles } from "../styles";
import { ListMenu } from "../components/ListMenu";
import { FooterSign } from "./FooterSign";
import { iconSelection } from "../utils/forListFiles";
import { readCertKeys } from "../actions/certKeysAction";
import * as Modal from "react-native-modalbox";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { checkFiles } from "../actions";

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
		version: any
	};
	img: string;
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
	personalCert: IPersonalCert;
	files: IFile[];
	isFetching: boolean;
	tempFiles: any;
	readCertKeys(): void;
	checkFiles(res: object, workspace: string): void;
}

interface SignatureState {
	isSuccess: boolean;
	href: string;
	chrome: string;
	modalWarning: boolean;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class SignForCryptoArmDoc extends React.Component<SignatureProps, SignatureState> {

	constructor(props) {
		super(props);
		this.state = {
			isSuccess: false,
			modalWarning: false,
			href: "",
			chrome: "",
		};
		this.props.navigation.state.key = "HomeSign";
	}

	showList(img) {
		return (
			this.props.tempFiles.arrFiles.map((file, key) =>
				<ListMenu
					key={key + file.id}
					title={file.filename}
					// note={file.date + " " + file.month + " " + file.year + ", " + file.time}
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
		const { files, readCertKeys, personalCert, isFetching, tempFiles } = this.props;
		const { navigate } = this.props.navigation;

		const img = iconSelection(files, files.length); // какое расширение у файлов
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
				<ListMenu title={personalCert.cert.subjectFriendlyName} img={personalCert.img}
					note={personalCert.cert.organizationName} nav={() => { readCertKeys(); navigate("SelectPersonalСert"); }} />
			</List>;
		} else {
			certificate = <View style={styles.sign_enc_view}>
				<Text onPress={() => { readCertKeys(); navigate("SelectPersonalСert"); }} style={styles.sign_enc_prompt}>[Добавьте сертификат подписчика]</Text>
			</View>;
		}

		let selectFilesView;
		if (this.props.tempFiles.arrFiles.length) { // выбраны ли файлы
			selectFilesView = <Text style={styles.selectFiles}>
				выбрано файлов: {this.props.tempFiles.arrFiles.length} </Text>;
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
								this.state.isSuccess
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
								this.props.navigation.navigate("Main");
							}}>
								<Text style={{ fontSize: 15, textAlign: "center", color: "grey" }}>Подтверить</Text>
							</Button>
						</View>
					</View>
				</Modal>
			</Container>
		);
	}
}