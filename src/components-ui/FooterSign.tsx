import * as React from "react";
import { NativeModules, Alert, AlertIOS } from "react-native";
import * as RNFS from "react-native-fs";
import { Footer, FooterTab } from "native-base";
import { FooterButton } from "../components/FooterButton";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { signFile, verifySign } from "../actions/signVerifyAction";
import { uploadFile, deleteFile } from "../actions/uploadFileAction";
import { readFiles } from "../actions/index";

function mapStateToProps(state) {
	return {
		files: state.files.files,
		footer: state.footer,
		personalCert: state.personalCert
	};
}

function mapDispatchToProps(dispatch) {
	return {
		signFile: bindActionCreators(signFile, dispatch),
		verifySign: bindActionCreators(verifySign, dispatch),
		uploadFile: bindActionCreators(uploadFile, dispatch),
		deleteFile: bindActionCreators(deleteFile, dispatch),
		readFiles: bindActionCreators(readFiles, dispatch)
	};
}

interface IFile {
	mtime: string;
	extension: string;
	extensionAll?: string;
	name: string;
}

interface FooterSignProps {
	footer?: any;
	files?: IFile[];
	personalCert?: any;
	nav?(msg: string): any;
	signFile?(files: IFile[], personalCert: string[], footer: string[], detached: boolean, toast: Function): void;
	verifySign?(files: IFile[], personalCert: string[], footer: string[]): void;
	uploadFile?(files: IFile[], footer: string[]): void;
	deleteFile?(files: IFile[], footer: string[]): void;
	readFiles?(): any;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class FooterSign extends React.Component<FooterSignProps, { showToast: boolean }> {

	constructor(props) {
		super(props);
		this.state = {
			showToast: false
		};
	}

	onPressUnSignFile() {
		for (let i = 0; i < this.props.footer.arrButton.length; i++) {
			let path = RNFS.DocumentDirectoryPath + "/Files/" + this.props.files[this.props.footer.arrButton[i]].name + "." + this.props.files[this.props.footer.arrButton[i]].extensionAll;
			const read = RNFS.read(path, 2, 0, "utf8");
			read.then(
				response => {
					debugger;
					NativeModules.Wrap_Signer.unSign(
						path,
						"BASE64",
						path.substr(0, path.length - 4),
						(err) => {
							if (err) {
								this.props.nav("Открепленная подпись. При снятии подписи произошла ошибка.");
							} else {
								RNFS.unlink(path);
								this.props.readFiles();
								this.props.nav("Подпись была успешно снята");
							}
						});
				},
				err => {
					debugger;
					NativeModules.Wrap_Signer.unSign(
						path,
						"DER",
						path.substr(0, path.length - 4),
						(err) => {
							if (err) {
								this.props.nav("Открепленная подпись. При снятии подписи произошла ошибка.");
							} else {
								RNFS.unlink(path);
								this.props.readFiles();
								this.props.nav("Подпись была успешно снята");
							}
						});
				})
				;
		}
	}

	render() {
		const { files, personalCert, verifySign, signFile, uploadFile, deleteFile, footer, nav } = this.props;
		let certIsNotNull, isSign, allIsSign = null;
		if (!personalCert.title) {
			certIsNotNull = "noCert";
		}
		if (footer.arrExtension.length === footer.arrExtension.filter(extension => extension === "sig").length) {
			allIsSign = "sig";
		}
		if (footer.arrExtension.filter(extension => extension === "sig").length !== 0) {
			isSign = "sig";
		}
		return (
			<Footer>
				<FooterTab>
					<FooterButton title="Проверить"
						disabled={allIsSign === "sig" ? false : true}
						icon="md-done-all"
						nav={() => verifySign(files, personalCert, footer, )} />
					<FooterButton title="Подписать"
						disabled={certIsNotNull === "noCert" ? true : (isSign === "sig" ? true : false)}
						icon="md-create"
						nav={() => AlertIOS.alert(
							"Подписать",
							null,
							[
								{ text: "совмещенной подписью", onPress: () => signFile(files, personalCert, footer, false, msg => nav(msg)) },
								{ text: "отделенной подписью", onPress: () => signFile(files, personalCert, footer, true, msg => nav(msg)) },
								{ text: "Отмена", onPress: () => null, style: "destructive" }
							]
						)} />
					<FooterButton title="Снять" disabled={allIsSign === "sig" ? false : true} icon="md-crop" nav={() => this.onPressUnSignFile()} />
					<FooterButton title="Отправить" disabled={footer.arrExtension.length === 1 ? false : true} icon="ios-share-alt-outline" nav={() => uploadFile(files, footer)} />
					<FooterButton title="Удалить" icon="md-trash" nav={() => deleteFile(files, footer)} />
				</FooterTab>
			</Footer>
		);
	}
}