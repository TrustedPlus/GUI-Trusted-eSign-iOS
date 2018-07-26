import * as React from "react";
import { Footer, FooterTab, Text, View, Button } from "native-base";
import { FooterButton } from "../components/FooterButton";

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
	uploadFile?(files: IFile[], selectedFiles: ISelectedFiles): void;
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

@(connect(null, mapDispatchToProps) as any)
export class FooterDoc extends React.Component<FooterDocProps, FooterDocState> {

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
			<Footer>
				<FooterTab>
					{this.state.modalMore
						? <View style={[styles.modalMore, styles.modalMore6]}>
							<Footer>
								<FooterTab>
									<FooterButton title="Проверить"
										disabled={mark !== 1}
										icon="md-done-all"
										nav={() => verifySign(files, selectedFilesObject)} />
									<FooterButton title="Снять"
										disabled={mark !== 1}
										icon="md-crop"
										nav={() => { clearAllFilesinAllWorkspace(); UnSignFile(files, selectedFilesObject, () => clearselectedFiles()); }} />
									<FooterButton title="Свойства"
										disabled={mark !== 1 || this.props.selectedFiles.arrNum.length !== 1}
										icon="ios-information"
										nav={() => getSignInfo(files, selectedFilesObject, (page, cert) => navigate(page, { cert: cert }))} />
								</FooterTab>
							</Footer>
							<Footer>
								<FooterTab>
									<FooterButton title="Раcшифровать"
										disabled={mark !== 2}
										icon="md-unlock"
										style={{ borderTopWidth: 0 }}
										nav={() => { clearAllFilesinAllWorkspace(); decAssymmetric(files, selectedFilesObject, () => clearselectedFiles()); }} />
									<FooterButton title="Архивировать" disabled={true} icon="help" nav={() => null} style={{ borderTopWidth: 0 }} />
									<FooterButton title="Удалить"
										icon="ios-trash"
										style={{ borderTopWidth: 0 }}
										nav={() => { clearAllFilesinAllWorkspace(); deleteFile(files, selectedFiles, () => clearselectedFiles()); }} />
								</FooterTab>
							</Footer>
						</View>
						: null}
					<FooterButton title="Подписать"
						icon="md-create"
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
						icon="md-lock"
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
						disabled={selectedFiles.arrNum.length === 1 ? false : true}
						icon="ios-share-alt-outline"
						nav={() => uploadFile(files, selectedFiles)} />
					<FooterButton title="Больше"
						icon="ios-more"
						nav={() => this.setState({ modalMore: !this.state.modalMore })} />
				</FooterTab>
			</Footer>
		);
	}
}