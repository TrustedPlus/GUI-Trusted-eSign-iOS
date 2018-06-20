import * as React from "react";
import { Container, Content, List } from "native-base";
import { StackNavigator } from "react-navigation";
import { styles } from "../styles";

import { ListMenu } from "../components/ListMenu";
import { Headers } from "../components/Headers";
import { ListCertCategory } from "./ListCertCategory";
import { PropertiesCert } from "./PropertiesCert";
import { SelectPersonalСert } from "./SelectPersonalСert";
import { ExportCert } from "./ExportCert";
import { CreateCertificate } from "./CreateCertificate";
import { Signature } from "./Signature";
import { Encryption } from "./Encryption";
import { Certificate } from "./Certificate";
import { Journal } from "./Journal";
import { SelectCert } from "./SelectCert";
import { Containers } from "./Containers";
import { Documents } from "./Documents";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getProviders } from "../actions/getContainersAction";
import { readCertKeys } from "../actions/certKeysAction";
import { readFiles } from "../actions/index";

function mapStateToProps(state) {
	return {
		certificates: state.certificates.certificates,
		files: state.files.files,
		lastlog: state.logger.lastlog,
		containers: state.containers.containers
	};
}

function mapDispatchToProps(dispatch) {
	return {
		readFiles: bindActionCreators(readFiles, dispatch),
		readCertKeys: bindActionCreators(readCertKeys, dispatch),
		getProviders: bindActionCreators(getProviders, dispatch)
	};
}

interface MainProps {
	navigation: any;
	files: any;
	certificates: any;
	containers: any;
	lastlog: string;
	readCertKeys(): any;
	readFiles(): any;
	getProviders(): any;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
class Main extends React.Component<MainProps> {

	static navigationOptions = {
		header: null
	};

	render() {
		const { navigate } = this.props.navigation;
		const { files, certificates, lastlog, containers } = this.props;
		let length = "выбрано файлов: " + files.length;
		let persCert = "личных сертификатов: " + certificates.filter(cert => cert.category.toUpperCase() === "MY").length;
		let lengthContainers = "количество контейнеров: " + containers.length;
		let lastlognote = lastlog ? "последняя запись: " + lastlog : "действий не совершалось";
		return (
			<Container style={styles.container}>
				<Headers title="КриптоАРМ" />
				<Content>
					<List>
						<ListMenu title="Подпись / Проверка подписи" img={require("../../imgs/general/sign_main_icon.png")}
							note={length} nav={() => navigate("Signature", { name: "Signature" })} />
						<ListMenu title="Шифрование / Расшифрование" img={require("../../imgs/general/encode_main_icon.png")}
							note={length} nav={() => navigate("Encryption", { name: "Encryption" })} />
						<ListMenu title="Управление сертификатами" img={require("../../imgs/general/certificates_main_icon.png")}
							note={persCert} nav={() => navigate("Certificate", { name: "Certificate" })} />
						<ListMenu title="Документы" img={require("../../imgs/general/documents_main_icon.png")}
							nav={() => navigate("Documents")} />
						<ListMenu title="Управление контейнерами" img={require("../../imgs/general/stores_main_icon.png")}
							note={lengthContainers} nav={() => navigate("Containers", { name: "Containers" })} />
						<ListMenu title="Журнал операций" img={require("../../imgs/general/journal_main_icon.png")}
							note={lastlognote} nav={() => navigate("Journal")} />
					</List>
				</Content>
			</Container>
		);
	}

	componentDidMount() {
		this.props.readFiles();
		this.props.readCertKeys();
		this.props.getProviders();
	}
}

export const App = StackNavigator({
	Main: { screen: Main },
	Signature: { screen: Signature },
	Encryption: { screen: Encryption },
	Certificate: { screen: Certificate },
	Journal: { screen: Journal },
	ListCertCategory: { screen: ListCertCategory },
	PropertiesCert: { screen: PropertiesCert },
	SelectPersonalСert: { screen: SelectPersonalСert },
	CreateCertificate: { screen: CreateCertificate },
	ExportCert: { screen: ExportCert },
	SelectCert: { screen: SelectCert },
	Containers: { screen: Containers },
	Documents: { screen: Documents }
});

/* NativeModules.Wrap_Main.connect(RNFS.DocumentDirectoryPath, (veify, err) => {
			RNFS.readDir("/var/mobile/Library/Mobile Documents/iCloud~com~digt~CryptoARMGOST/Documents/").then(
				fileForCloud => {
					console.log(fileForCloud);
					for (let i = 0; i < fileForCloud.length; i++) {
						if (fileForCloud[i].name.indexOf(".icloud") !== -1) {
							NativeModules.Wrap_Main.downloadingFileFromiCloud(fileForCloud[i].path, (veify, err) => {
								RNFS.readDir("/var/mobile/Library/Mobile Documents/iCloud~com~digt~CryptoARMGOST/Documents/").then(
									newFileForCloud => console.log(newFileForCloud)
								);
								let correctName = fileForCloud[i].name;
								correctName = correctName.replace(".icloud", "");
								correctName = correctName.slice(1);
								debugger;
								RNFS.copyFile("/var/mobile/Library/Mobile Documents/iCloud~com~digt~CryptoARMGOST/Documents/" + correctName, RNFS.DocumentDirectoryPath + "/Files/" + correctName).then(
									this.props.readFiles()
								);
							});
						} else if (fileForCloud[i].name[0] === ".") {
							continue;
						} else {
							RNFS.copyFile("/var/mobile/Library/Mobile Documents/iCloud~com~digt~CryptoARMGOST/Documents/" + fileForCloud[i].name, RNFS.DocumentDirectoryPath + "/Files/" + fileForCloud[i].name).then(
								success => {
									this.props.readFiles();
								},
								err => {
									RNFS.unlink(RNFS.DocumentDirectoryPath + "/Files/" + fileForCloud[i].name).then(
										() => RNFS.copyFile("/var/mobile/Library/Mobile Documents/iCloud~com~digt~CryptoARMGOST/Documents/" + fileForCloud[i].name, RNFS.DocumentDirectoryPath + "/Files/" + fileForCloud[i].name).then(
											() => {
												this.props.readFiles();
											}
										)
									);
								}
							);
						}
					}
					RNFS.readDir(RNFS.DocumentDirectoryPath + "/Files/").then(
						fileForApps => {
							console.log(fileForApps);
							for (let i = 0; i < fileForApps.length; i++) {
								if (fileForApps[i].name[0] === ".") {
									continue;
								}
								console.log(fileForApps[i]);
								RNFS.copyFile(fileForApps[i].path, "/var/mobile/Library/Mobile Documents/iCloud~com~digt~CryptoARMGOST/Documents/" + fileForApps[i].name).catch(
									err => console.log(err.message)
								);
							}
						}
					);
				},
				err => console.log(err)
			);
		}); */

/*RNFS.readDir("/var/mobile/Library/Mobile Documents/iCloud~com~digt~CryptoARMGOST/Documents/").then(
						fileForCloud => {
							console.log(fileForCloud);
							for (let i = 0; i < fileForCloud.length; i++) {
								if (fileForCloud[i].name[0] === ".") {
									continue;
								}
								RNFS.copyFile("/var/mobile/Library/Mobile Documents/iCloud~com~digt~CryptoARMGOST/Documents/" + fileForCloud[i].name, RNFS.DocumentDirectoryPath + "/Files/" + fileForCloud[i].name).then().catch(
									() => {
										RNFS.unlink(RNFS.DocumentDirectoryPath + "/Files/" + fileForCloud[i].name).then(
											() => RNFS.copyFile("/var/mobile/Library/Mobile Documents/iCloud~com~digt~CryptoARMGOST/Documents/" + fileForCloud[i].name, RNFS.DocumentDirectoryPath + "/Files/" + fileForCloud[i].name)
										);
									}
								);*/