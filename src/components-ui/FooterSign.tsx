import * as React from "react";
import { Footer, FooterTab, Text, View, ListItem, Header, Title, Button } from "native-base";
import { FooterButton } from "../components/FooterButton";
import { ListWithModalDropdown } from "../components/ListWithModalDropdown";
import { ListWithSwitch } from "../components/ListWithSwitch";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { signFile, verifySign, UnSignFile, getSignInfo } from "../actions/signVerifyAction";
import { uploadFile, deleteFile } from "../actions/uploadFileAction";
import { readFiles } from "../actions";

import * as Modal from "react-native-modalbox";
import { styles } from "../styles";
import { clearOriginalFileInWorkspaceSign } from "../actions/workspaceAction";
import { tempFilesFunction } from "../reducers/uploadFileToCryptoArmDocumtsReducer";
import { AlertIOS } from "react-native";

function mapDispatchToProps(dispatch) {
	return {
		signFile: bindActionCreators(signFile, dispatch),
		verifySign: bindActionCreators(verifySign, dispatch),
		UnSignFile: bindActionCreators(UnSignFile, dispatch),
		uploadFile: bindActionCreators(uploadFile, dispatch),
		deleteFile: bindActionCreators(deleteFile, dispatch),
		getSignInfo: bindActionCreators(getSignInfo, dispatch),
		readFiles: bindActionCreators(readFiles, dispatch),
		clearOriginalFileInWorkspaceSign: bindActionCreators(clearOriginalFileInWorkspaceSign, dispatch)
	};
}

function mapStateToProps(state) {
	return {
		tempFiles: state.tempFiles.tempFiles
	};
}

interface IFile {
	mtime: string;
	extension: string;
	extensionAll?: string;
	name: string;
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

interface FooterSignProps {
	footer?: any;
	files?: any;
	personalCert?: IPersonalCert;
	modalView?: Function;
	navigate?: any;
	tempFiles?: any;
	modalSuccessUpload?(isSuccess, browser, href): void;
	clearselectedFiles?(num);
	clearOriginalFileInWorkspaceSign?(name, extensionAll);
	readFiles?(): void;
	signFile?(files: IFile[], personalCert: IPersonalCert, footer: string[], detached: boolean, signature: string, clearselectedFiles: Function, tempFiles: object, navigate: void, isSuccessUpload: Function): void;
	verifySign?(files: IFile[], footer: string[]): void;
	UnSignFile?(files: IFile[], footer: string[], clearselectedFiles: Function): void;
	uploadFile?(files: IFile[], footer: Object, refreshingFiles: Function, page: string): void;
	deleteFile?(files: IFile[], footer: string[]): void;
	getSignInfo?(files: IFile[], footer: string[], navigate): void;
}

interface FooterSignState {
	signature: string;
	detached: boolean;
	isSign: boolean;
	modalMore: boolean;
	modalSign: boolean;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class FooterSign extends React.Component<FooterSignProps, FooterSignState> {

	constructor(props) {
		super(props);
		this.state = {
			signature: "BASE-64",
			detached: false,
			isSign: false,
			modalMore: false,
			modalSign: false
		};
	}

	clearSelectedFilesInWorkspaceSign() {
		for (let i = 0; i < this.props.footer.arrButton.length; i++) {
			this.props.clearOriginalFileInWorkspaceSign(this.props.files[this.props.footer.arrButton[i]].name, this.props.files[this.props.footer.arrButton[i]].extensionAll);
		}
		this.props.clearselectedFiles(-1);
	}

	render() {
		const { files, personalCert, verifySign, signFile, UnSignFile, uploadFile, deleteFile, footer, getSignInfo, navigate, readFiles } = this.props;
		let certIsNotNull, allIsSign = null, numSelectedFilesIsOne = false;
		if (!personalCert.cert.subjectFriendlyName) {
			certIsNotNull = "noCert";
		}
		if (footer.arrExtension.length === footer.arrExtension.filter(extension => extension === "sig").length) {
			allIsSign = "sig";
		}
		if (footer.arrExtension.length === 1) {
			numSelectedFilesIsOne = true;
		}
		// deleteFile(files, footer)
		// <FooterButton title="Снять" disabled={allIsSign === "sig" ? false : true} icon="md-crop" nav={() => UnSignFile(files, footer)} />
		// <FooterButton title="Отправить" disabled={footer.arrExtension.length === 1 ? false : true} icon="ios-share-alt-outline" nav={() => uploadFile(files, footer)} />
		//
		return (
			<>
				<Footer style={{position: "absolute", bottom: 0}}>
					<FooterTab>
						{this.state.modalMore
							? <View style={[styles.modalMore, styles.modalMore4]}>
								<Footer>
									<FooterTab>
										<FooterButton title="Снять"
											disabled={allIsSign === "sig" ? false : true}
											img={require("../../imgs/ios/delete_sign.png")}
											nav={() => UnSignFile(files, footer, (num) => this.props.clearselectedFiles(num))} />
										<FooterButton title="Отправить"
											img={require("../../imgs/ios/posted.png")}
											nav={() => uploadFile(files, { arrNum: footer.arrButton, arrExtension: footer.arrExtension },
												(num) => this.props.clearselectedFiles(num), "sig"
											)} />
									</FooterTab>
								</Footer>
								<Footer>
									<FooterTab>
										<FooterButton title="Архивировать"
											disabled={true}
											img={require("../../imgs/ios/arhiver.png")}
											nav={() => null}
											style={{ borderTopWidth: 0 }} />
										<FooterButton title="Очистить"
											img={require("../../imgs/ios/delete.png")}
											nav={() => this.clearSelectedFilesInWorkspaceSign()}
											style={{ borderTopWidth: 0 }} />
									</FooterTab>
								</Footer>
							</View>
							: null}
						<FooterButton title="Проверить"
							disabled={allIsSign === "sig" ? false : true}
							img={require("../../imgs/ios/verify_sign.png")}
							nav={() => { this.setState({ modalMore: false }); verifySign(files, footer); }} />
						<FooterButton title="Подписать"
							disabled={certIsNotNull === "noCert" ? true : false}
							img={require("../../imgs/ios/sign.png")}
							nav={() => {
								allIsSign === "sig"
									? signFile(files, personalCert, footer, null, null, (num) => this.props.clearselectedFiles(num), this.props.tempFiles, navigate, (isSuccess, browser, href) => this.props.modalSuccessUpload(isSuccess, browser, href))
									: this.setState({ modalSign: true });
							}} />
						<FooterButton title="Свойства" disabled={numSelectedFilesIsOne ? allIsSign === "sig" ? false : true : true} img={require("../../imgs/ios/view_sign.png")} nav={() => getSignInfo(files, footer, navigate)} />
						<FooterButton title="Больше" disabled={this.props.tempFiles.arrFiles === null ? false : true} icon="ios-more" nav={() => this.setState({ modalMore: !this.state.modalMore })} />
					</FooterTab>
				</Footer>
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
							disabled={this.props.tempFiles.arrFiles === null ? false : true}
							value={this.state.detached}
							changeValue={() => this.setState({ detached: !this.state.detached })} />
						<View style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap", justifyContent: "space-around", maxWidth: "100%" }}>
							<Button transparent style={styles.modalMain} onPress={() => this.setState({ modalSign: false })}>
								<Text style={{ fontSize: 15, textAlign: "center", color: "grey" }}>Отмена</Text>
							</Button>
							<Button transparent style={styles.modalMain} onPress={() => { this.setState({ modalSign: false }); signFile(files, personalCert, footer, this.state.detached, this.state.signature, (num) => this.props.clearselectedFiles(num), this.props.tempFiles, navigate, (isSuccess, browser, href) => this.props.modalSuccessUpload(isSuccess, browser, href)); }}>
								<Text style={{ fontSize: 15, textAlign: "center", color: "grey" }}>Применить</Text>
							</Button>
						</View>
					</View>
				</Modal>
			</>
		);
	}
}