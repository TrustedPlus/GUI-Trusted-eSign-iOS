import * as React from "react";
import { Container, Content, Text, Footer, FooterTab, Button, View, Form, Item, Label, Input } from "native-base";
import { NativeModules, Alert, Share } from "react-native";
import { styles } from "../styles";
import * as RNFS from "react-native-fs";
import { Headers } from "../components/Headers";
import { ListWithModalDropdown } from "../components/ListWithModalDropdown";

interface ExportCertProps {
	navigation: any;
	goBack: void;
}

interface ExportCertState {
	format: number;
	password: string;
	passConfirm: string;
	fileName: string;
	code: number;
}

export class ExportCert extends React.Component<ExportCertProps, ExportCertState> {

	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
		this.state = {
			format: 1,
			password: "",
			passConfirm: "",
			fileName: this.props.navigation.state.params.cert.subjectFriendlyName,
			code: 0
		};
	}

	ExportCert() {
		if (!this.state.fileName) {
			Alert.alert("Имя файла не может быть пустым");
		} else {
			let path = RNFS.DocumentDirectoryPath + "/" + this.state.fileName;
			if (this.state.format) {
				path = path + ".crt";
				NativeModules.Wrap_Cert.load(
					this.props.navigation.state.params.cert.serialNumber,
					this.props.navigation.state.params.cert.provider,
					(err, load) => {
						NativeModules.Wrap_Cert.save(
							path,
							this.state.code ? "DER" : "BASE64",
							(err, load) => {
								if (err) {
									Alert.alert(err + "");
								} else {
									Share.share({
										url: path
									}).then((action : {action}) => {
										() => RNFS.unlink(path);
										if (action.action === Share.dismissedAction) {
											Alert.alert("Отправка файла была отклонена");
										} else {
											Alert.alert("Файл успешно отправлен");
										}
									}).catch(
										errorMsg => Alert.alert("Ошибка при экспорте сертификата")
									);
								}
							});
					});
			} else {
				path = path + ".pfx";
				if (this.state.password !== this.state.passConfirm) {
					Alert.alert("Пароли не совпадают");
				} else {
					NativeModules.Wrap_Pkcs12.exportPFX(
						this.props.navigation.state.params.cert.serialNumber,
						this.props.navigation.state.params.cert.category,
						this.props.navigation.state.params.cert.provider,
						true,
						this.state.password,
						path,
						(err, exp) => {
							if (err) {
								Alert.alert(err);
							} else {
								Share.share({
									url: path
								}).then((action : {action}) => {
									() => RNFS.unlink(path);
									if (action.action === Share.dismissedAction) {
										Alert.alert("Отправка файла была отклонена");
									} else {
										Alert.alert("Файл успешно отправлен");
									}
								}).catch(
									errorMsg => Alert.alert("Ошибка при экспорте сертификата")
								);
							}
						});
				}
			}
		}
	}

	render() {
		const { navigate, goBack } = this.props.navigation;
		const { cert } = this.props.navigation.state.params;
		console.log(this.state);
		return (
			<Container style={styles.container}>
				<Headers title="Экспорт сертификата" goBack={() => goBack()} />
				<Content>
					<View style={styles.sign_enc_view}>
						<Text style={{ color: "grey", paddingLeft: 5, paddingRight: 5 }}>Формат экспортируемого файла: {!this.state.format ? "Файл обмена личной информацией PKCS#12 (PFX)" : "X509 (.CER) в кодировке BASE64"}</Text>
						<View style={{ paddingLeft: 15, paddingRight: 15 }}>
							<ListWithModalDropdown text="Экспортировать закрытый ключ вместе с сертификатом?"
								defaultValue="Не экспортировать закрытый ключ"
								changeValue={(value, index) => this.setState({ format: Number(index) })}
								options={[{ value: "Экспортировать закрытый ключ" }, { value: "Не экспортировать закрытый ключ" }]} />
						</View>
					</View>
					{!this.state.format ? <View style={styles.sign_enc_view}>
						<Text style={{ color: "grey", paddingLeft: 5, paddingRight: 5 }}>Укажите пароль для защиты закрытого ключа:</Text>
						<Form>
							<Item floatingLabel>
								<Label>Пароль</Label>
								<Input secureTextEntry onChangeText={(password) => this.setState({ password })} />
							</Item>
							<Item floatingLabel>
								<Label>Подтверждение пароля</Label>
								<Input secureTextEntry onChangeText={(passConfirm) => this.setState({ passConfirm })} />
							</Item>
						</Form>
					</View> : <View style={styles.sign_enc_view}>
							<Text style={{ color: "grey", paddingLeft: 5, paddingRight: 5 }}>Выберите тип кодировкиля примениения в экспортируемом файле:</Text>
							<View style={{ paddingLeft: 15, paddingRight: 15 }} >
								<ListWithModalDropdown text="Кодировка"
									defaultValue="BASE-64"
									changeValue={(value, index) => this.setState({ code: Number(index) })}
									options={[{ value: "BASE-64" }, { value: "DER" }]} />
							</View>
						</View>}
					<View style={styles.sign_enc_view}>
						<Text style={{ color: "grey", paddingLeft: 5, paddingRight: 5 }}>Сохранить как:</Text>
						<Form>
							<Item stackedLabel>
								<Input defaultValue={cert.subjectFriendlyName} onChangeText={(fileName) => this.setState({ fileName })} />
							</Item>
						</Form>
					</View>
				</Content>
				<Footer>
					<FooterTab>
						<Button vertical onPress={() => this.ExportCert()} >
							<Text style={{ color: "black" }}>Экспортировать</Text>
						</Button>
					</FooterTab>
				</Footer>
			</Container>
		);
	}
}