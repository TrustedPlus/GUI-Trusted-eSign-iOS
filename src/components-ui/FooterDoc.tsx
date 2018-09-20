import * as React from "react";
import { Footer, FooterTab, Text, View, Button, Header, Title } from "native-base";
import { FooterButton } from "../components/FooterButton";
import * as Modal from "react-native-modalbox";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { signFile, verifySign, UnSignFile, getSignInfo } from "../actions/signVerifyAction";
import { uploadFile, deleteFile } from "../actions/uploadFileAction";
import { addFilesInWorkspaceSign, addFilesInWorkspaceEnc, clearAllFilesinAllWorkspace } from "../actions/workspaceAction";
import { decAssymmetric } from "../actions/encDecAction";
import { readFiles } from "../actions";

import { styles } from "../styles";

function mapDispatchToProps(dispatch) {
	return {
		signFile: bindActionCreators(signFile, dispatch),
		verifySign: bindActionCreators(verifySign, dispatch),
		UnSignFile: bindActionCreators(UnSignFile, dispatch),
		uploadFile: bindActionCreators(uploadFile, dispatch),
		deleteFile: bindActionCreators(deleteFile, dispatch),
		getSignInfo: bindActionCreators(getSignInfo, dispatch),
		addFilesInWorkspaceSign: bindActionCreators(addFilesInWorkspaceSign, dispatch),
		decAssymmetric: bindActionCreators(decAssymmetric, dispatch),
		addFilesInWorkspaceEnc: bindActionCreators(addFilesInWorkspaceEnc, dispatch),
		clearAllFilesinAllWorkspace: bindActionCreators(clearAllFilesinAllWorkspace, dispatch),
		readFiles: bindActionCreators(readFiles, dispatch),
	};
}

interface IFile {
	mtime: string;
	extension: string;
	extensionAll?: string;
	name: string;
}

interface ISelectedFiles {
	arrNum: Array<number>;
	arrExtension: Array<string>;
}

interface FooterDocProps {
	selectedFiles?: ISelectedFiles;
	files?: any;
	modalView?: Function;
	navigate?: any;
	clearselectedFiles?(): void;
	verifySign?(files: IFile[], selectedFiles: Object): void;
	UnSignFile?(files: IFile[], selectedFiles: Object, clearselectedFiles: Function): void;
	uploadFile?(files: IFile[], selectedFiles: ISelectedFiles, refreshingFiles: Function, page: string): void;
	deleteFile?(files: IFile[], selectedFiles: ISelectedFiles, clearselectedFiles: Function): void;
	getSignInfo?(files: IFile[], selectedFiles: Object, navigate): void;
	addFilesInWorkspaceSign?(files: IFile[], selectedFiles: ISelectedFiles);
	decAssymmetric?(files: IFile[], selectedFiles: Object, clearselectedFiles: Function): void;
	addFilesInWorkspaceEnc?(files: IFile[], selectedFiles: ISelectedFiles);
	clearAllFilesinAllWorkspace?();
	readFiles?(): void;
}

interface FooterDocState {
	modalMore: boolean;
}

enum WhatSelected {
	"other", "allSig", "allEnc", "selected sign", "selected enc", "selected enc and sign"
}

interface IModals {
	basicModal: Modal.default;
}

@(connect(null, mapDispatchToProps) as any)
export class FooterDoc extends React.Component<FooterDocProps, FooterDocState> {

	private modals: IModals = {
		basicModal: null
	};

	constructor(props) {
		super(props);
		this.state = {
			modalMore: false
		};
	}

	render() {
		const {
			selectedFiles, files, navigate, clearselectedFiles,
			addFilesInWorkspaceSign, addFilesInWorkspaceEnc,
			uploadFile, deleteFile, readFiles,
			verifySign, UnSignFile, getSignInfo,
			decAssymmetric, clearAllFilesinAllWorkspace } = this.props;
		const selectedFilesObject = { arrButton: selectedFiles.arrNum, arrExtension: selectedFiles.arrExtension };
		let mark: WhatSelected = 0;

		if (selectedFiles.arrExtension.filter(extension => extension === "sig").length >= 1 && selectedFiles.arrExtension.filter(extension => extension === "enc").length >= 1) {
			mark = 5;
		} else {
			if (selectedFiles.arrExtension.filter(extension => extension === "sig").length) {
				mark = 3;
			}
			if (selectedFiles.arrExtension.filter(extension => extension === "enc").length) {
				mark = 4;
			}
		}
		if (selectedFiles.arrExtension.length === selectedFiles.arrExtension.filter(extension => extension === "sig").length) {
			mark = 1;
		} else {
			if (selectedFiles.arrExtension.length === selectedFiles.arrExtension.filter(extension => extension === "enc").length) {
				mark = 2;
			}
		}
		return (
			<>
				<Footer>
					<FooterTab>
						{this.state.modalMore
							? <View style={[styles.modalMore, styles.modalMore6]}>
								<Footer>
									<FooterTab>
										<FooterButton title="Проверить"
											disabled={mark !== 1}
											img={require("../../imgs/ios/verify_sign.png")}
											nav={() => verifySign(files, selectedFilesObject)} />
										<FooterButton title="Снять"
											disabled={mark !== 1}
											img={require("../../imgs/ios/delete_sign.png")}
											nav={() => { clearAllFilesinAllWorkspace(); UnSignFile(files, selectedFilesObject, () => clearselectedFiles()); }} />
										<FooterButton title="Свойства"
											disabled={mark !== 1 || this.props.selectedFiles.arrNum.length !== 1}
											img={require("../../imgs/ios/view_sign.png")}
											nav={() => getSignInfo(files, selectedFilesObject, (page, cert) => navigate(page, { cert: cert }))} />
									</FooterTab>
								</Footer>
								<Footer>
									<FooterTab>
										<FooterButton title="Раcшифровать"
											disabled={mark !== 2}
											img={require("../../imgs/ios/decrypt.png")}
											style={{ borderTopWidth: 0 }}
											nav={() => { clearAllFilesinAllWorkspace(); decAssymmetric(files, selectedFilesObject, () => clearselectedFiles()); }} />
										<FooterButton title="Архивировать"
											disabled={true}
											img={require("../../imgs/ios/arhiver.png")}
											nav={() => null}
											style={{ borderTopWidth: 0 }} />
										<FooterButton title="Удалить"
											img={require("../../imgs/ios/delete.png")}
											style={{ borderTopWidth: 0 }}
											nav={() => this.modals.basicModal.open()} />
									</FooterTab>
								</Footer>
							</View>
							: null}
						<FooterButton title="Подписать"
							img={require("../../imgs/ios/sign.png")}
							disabled={(mark === 5) || (mark === 4) || (mark === 2)}
							nav={() => {
								let selectedFilesForSign = [];
								for (let i = 0; i < selectedFiles.arrNum.length; i++) {
									selectedFilesForSign.push(i);
								}
								addFilesInWorkspaceSign(files, selectedFiles); navigate("Signature", { selectedFiles: { arrNum: selectedFilesForSign, arrExtension: selectedFiles.arrExtension } });
								setTimeout(
									() => {
										clearselectedFiles();
										readFiles();
									},
									600
								);
							}} />
						<FooterButton title="Зашифровать"
							img={require("../../imgs/ios/encrypt.png")}
							disabled={(mark === 5) || (mark === 3) || (mark === 1)}
							nav={() => {
								let selectedFilesForEnc = [];
								for (let i = 0; i < selectedFiles.arrNum.length; i++) {
									selectedFilesForEnc.push(i);
								}
								addFilesInWorkspaceEnc(files, selectedFiles); navigate("Encryption", { selectedFiles: { arrNum: selectedFilesForEnc, arrExtension: selectedFiles.arrExtension } }); setTimeout(
									() => {
										clearselectedFiles();
										readFiles();
									},
									600
								);
							}} />
						<FooterButton title="Отправить"
							img={require("../../imgs/ios/posted.png")}
							nav={() => {
								uploadFile(files, selectedFiles, () => {
									clearselectedFiles();
									readFiles();
								}, "doc");
							}} />
						<FooterButton title="Больше"
							icon="ios-more"
							nav={() => this.setState({ modalMore: !this.state.modalMore })} />
					</FooterTab>
				</Footer>
				<Modal
					ref={ref => this.modals.basicModal = ref}
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
								}}>Удаление файлов</Text>
							</Title>
						</Header>
						<View style={{
							padding: 15, height: 70
						}}>
							<Text style={{
								color: "grey",
								fontSize: 15
							}}>Выполнить удаление выбраных файлов с устройства?</Text>
						</View>
						<View style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap", justifyContent: "space-around", maxWidth: "100%" }}>
							<Button transparent style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: "50%", borderLeftWidth: 0.25, borderTopWidth: 0.5, borderColor: "grey", borderRadius: 0 }} onPress={() => this.modals.basicModal.close()}>
								<Text style={{ fontSize: 15, textAlign: "center", color: "grey" }}>Отмена</Text>
							</Button>
							<Button transparent style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: "50%", borderLeftWidth: 0.25, borderTopWidth: 0.5, borderColor: "grey", borderRadius: 0 }} onPress={() => { this.modals.basicModal.close(); clearAllFilesinAllWorkspace(); deleteFile(files, selectedFiles, () => clearselectedFiles()); }}>
								<Text style={{ fontSize: 15, textAlign: "center", color: "grey" }}>Да</Text>
							</Button>
						</View>
					</View>
				</Modal>
			</>
		);
	}
}