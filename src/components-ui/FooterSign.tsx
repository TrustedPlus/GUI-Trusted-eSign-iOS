import * as React from "react";
import { Footer, FooterTab, Text, View, ListItem, Header, Title, Button } from "native-base";
import { FooterButton } from "../components/FooterButton";
import { ListWithModalDropdown } from "../components/ListWithModalDropdown";
import { ListWithSwitch } from "../components/ListWithSwitch";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { signFile, verifySign, UnSignFile, getSignInfo } from "../actions/signVerifyAction";
import { uploadFile, deleteFile } from "../actions/uploadFileAction";

import * as Modal from "react-native-modalbox";
import { styles } from "../styles";
import { clearOriginalFileInWorkspaceSign } from "../actions/workspaceAction";

function mapDispatchToProps(dispatch) {
	return {
		signFile: bindActionCreators(signFile, dispatch),
		verifySign: bindActionCreators(verifySign, dispatch),
		UnSignFile: bindActionCreators(UnSignFile, dispatch),
		uploadFile: bindActionCreators(uploadFile, dispatch),
		deleteFile: bindActionCreators(deleteFile, dispatch),
		getSignInfo: bindActionCreators(getSignInfo, dispatch),
		clearOriginalFileInWorkspaceSign: bindActionCreators(clearOriginalFileInWorkspaceSign, dispatch)
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
	files?: any;
	personalCert?: any;
	modalView?: Function;
	navigate?: any;
	clearselectedFiles?(num);
	clearOriginalFileInWorkspaceSign?(name, extensionAll);
	refreshingFiles?();
	signFile?(files: IFile[], personalCert: string[], footer: string[], detached: boolean, signature: string, clearselectedFiles: Function): void;
	verifySign?(files: IFile[], footer: string[]): void;
	UnSignFile?(files: IFile[], footer: string[], clearselectedFiles: Function): void;
	uploadFile?(files: IFile[], footer: Object): void;
	deleteFile?(files: IFile[], footer: string[]): void;
	getSignInfo?(files: IFile[], footer: string[], navigate): void;
}

interface FooterSignState {
	signature: string;
	detached: boolean;
	isSign: boolean;
	modalMore: boolean;
}

interface IModals {
	basicModal: Modal.default;
}

@(connect(null, mapDispatchToProps) as any)
export class FooterSign extends React.Component<FooterSignProps, FooterSignState> {

	constructor(props) {
		super(props);
		this.state = {
			signature: "BASE-64",
			detached: false,
			isSign: false,
			modalMore: false
		};
	}

	private modals: IModals = {
		basicModal: null
	};

	clearSelectedFilesInWorkspaceSign() {
		for (let i = 0; i < this.props.footer.arrButton.length; i++) {
			this.props.clearOriginalFileInWorkspaceSign(this.props.files[this.props.footer.arrButton[i]].name, this.props.files[this.props.footer.arrButton[i]].extensionAll);
		}
		this.props.clearselectedFiles(-1);
	}

	render() {
		const { files, personalCert, verifySign, signFile, UnSignFile, uploadFile, deleteFile, footer, getSignInfo, navigate } = this.props;
		let certIsNotNull, allIsSign = null, numSelectedFilesIsOne = false;
		if (!personalCert.title) {
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
				<Footer>
					<FooterTab>
						{this.state.modalMore
							? <View style={[styles.modalMore, styles.modalMore4]}>
								<Footer>
									<FooterTab>
										<FooterButton title="Снять" disabled={allIsSign === "sig" ? false : true} icon="md-crop" nav={() => UnSignFile(files, footer, (num) => this.props.clearselectedFiles(num))} />
										<FooterButton title="Отправить" disabled={!numSelectedFilesIsOne} icon="ios-share-alt-outline" nav={() => uploadFile(files, { arrNum: footer.arrButton, arrExtension: footer.arrExtension })} />
									</FooterTab>
								</Footer>
								<Footer>
									<FooterTab>
										<FooterButton title="Архивировать" disabled={true} icon="help" nav={() => null} style={{ borderTopWidth: 0 }} />
										<FooterButton title="Очистить" icon="ios-trash" nav={() => this.clearSelectedFilesInWorkspaceSign()} style={{ borderTopWidth: 0 }} />
									</FooterTab>
								</Footer>
							</View>
							: null}
						<FooterButton title="Проверить"
							disabled={allIsSign === "sig" ? false : true}
							icon="md-done-all"
							nav={() => { this.setState({ modalMore: false }); verifySign(files, footer); }} />
						<FooterButton title="Подписать"
							disabled={certIsNotNull === "noCert" ? true : false}
							icon="md-create"
							nav={() => {
								allIsSign === "sig"
									? signFile(files, personalCert, footer, null, null, (num) => this.props.clearselectedFiles(num))
									: this.modals.basicModal.open();
							}} />
						<FooterButton title="Свойства" disabled={numSelectedFilesIsOne ? allIsSign === "sig" ? false : true : true} icon="ios-information" nav={() => getSignInfo(files, footer, (page, cert) => navigate(page, { cert: cert }))} />
						<FooterButton title="Больше" icon="ios-more" nav={() => this.setState({ modalMore: !this.state.modalMore })} />
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
								}}>Настройка подписи</Text>
							</Title>
						</Header>
						<ListWithModalDropdown text="Кодировка"
							defaultValue={this.state.signature}
							changeValue={(value) => this.setState({ signature: value })}
							options={[{ value: "BASE-64" }, { value: "DER" }]} />
						<ListWithSwitch text="Сохранить подпись отдельно" value={this.state.detached} changeValue={() => this.setState({ detached: !this.state.detached })} />
						<View style={{display: "flex", flexDirection: "row", flexWrap: "nowrap", justifyContent: "space-around", maxWidth: "100%"}}>
							<Button transparent style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: "50%", borderLeftWidth: 0.25, borderTopWidth: 0.5, borderColor: "grey", borderRadius: 0}} onPress={() => this.modals.basicModal.close()}>
								<Text style={{ fontSize: 15, textAlign: "center", color: "grey" }}>Отмена</Text>
							</Button>
							<Button transparent style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: "50%", borderLeftWidth: 0.25, borderTopWidth: 0.5, borderColor: "grey", borderRadius: 0}} onPress={() => {this.modals.basicModal.close(); signFile(files, personalCert, footer, this.state.detached, this.state.signature, (num) => this.props.clearselectedFiles(num)); }}>
								<Text style={{ fontSize: 15, textAlign: "center", color: "grey" }}>Применить</Text>
							</Button>
						</View>
					</View>
				</Modal>
			</>
		);
	}
}