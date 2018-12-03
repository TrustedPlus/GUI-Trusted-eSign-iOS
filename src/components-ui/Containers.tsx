import * as React from "react";
import { Container, Content, List, Text, Footer, FooterTab, View, Button, Header, Title, Spinner } from "native-base";
import { Headers } from "../components/Headers";
import { NativeModules, Image } from "react-native";
import { ListMenu } from "../components/ListMenu";
import { styles } from "../styles";
import { showToast } from "../utils/toast";
import { FooterButton } from "../components/FooterButton";
import * as Modal from "react-native-modalbox";
import { ListWithSwitch } from "../components/ListWithSwitch";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getProviders } from "../actions/getContainersAction";

function mapStateToProps(state) {
	return {
		containers: state.containers.containers,
		loadContainers: state.containers.loader,
		providers: state.containers.providers
	};
}

function mapDispatchToProps(dispatch) {
	return {
		getProviders: bindActionCreators(getProviders, dispatch)
	};
}

interface ContainersProps {
	navigation: any;
	goBack: void;
	containers: any;
	loadContainers: boolean;
	providers: any;
	getProviders(): void;
}

interface ContainersState {
	selectedContainers: any;
	deleteCert: boolean;
	loader: boolean;
}

interface IModals {
	basicModal: Modal.default;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class Containers extends React.Component<ContainersProps, ContainersState> {

	private modals: IModals = {
		basicModal: null
	};

	constructor(props) {
		super(props);

		this.state = {
			selectedContainers: [],
			deleteCert: true,
			loader: false
		},
			this.props.navigation.state.key = "Home";
	}

	clearSelectedCont() {
		this.setState({
			selectedContainers: [],
			deleteCert: true,
		});
	}

	changeSelectedContainers(oldSelectedContainers, key) {

		let index = oldSelectedContainers.indexOf(key);
		if (index !== -1) {
			oldSelectedContainers.splice(index, 1); // удаление из массива
			return oldSelectedContainers;
		}
		oldSelectedContainers.push(key);
		return oldSelectedContainers; // добавление в массив
	}

	showList() {
		if (this.props.containers[0]) {
			return (this.props.containers.map((containers, key) => <ListMenu
				styleImg={{ width: 40, height: 40 }}
				styleText={{ fontSize: 13 }}
				key={key + containers.container}
				note={containers.fqcnA.match(/\\{2}.\\[^\/]{1,}\\/) ? containers.fqcnA.match(/\\{2}.\\[^\/]{1,}\\/)[0].slice(4, -1) : null}
				title={containers.container}
				img={require("../../imgs/general/key_icon.png")}
				checkbox
				nav={() => this.setState({ selectedContainers: this.changeSelectedContainers(this.state.selectedContainers, key) })} />
			));
		}
	}

	deleteContainers() {
		this.modals.basicModal.close();
		this.setState({ loader: true });
		let promises = [];
		this.state.selectedContainers.map(
			container => {
				promises.push(
					new Promise((resolve, reject) => {
						NativeModules.Wrap_Main.deleteContainer(
							this.props.containers[container]["unique"],
							this.props.providers[1]["type"],
							this.props.providers[1]["name"],
							this.state.deleteCert,
							(err, verify) => {
								if (verify) {
									showToast("Контейнер удален");
								} else {
									showToast("Ошибка при удалении контейнера");
								}
								resolve();
							});
					})
				);
			}
		);
		Promise.all(promises).then(
			() => {
				this.setState({ selectedContainers: [] });
				this.setState({ loader: false });
				this.props.getProviders();
			}
		);
	}

	render() {
		const { goBack } = this.props.navigation;

		let loader = null;
		if (this.state.loader) {
			loader = <View style={styles.loader}>
				<View style={styles.loaderView}>
					<Spinner color={"#be3817"} />
					<Text style={{ fontSize: 17, color: "grey" }}>Операция{"\n"}выполняется</Text>
				</View>
			</View>;
		}
		return (
			<Container style={styles.container}>
				<Headers title="Контейнеры" goBack={() => goBack()} />
				{!this.props.loadContainers ? <>
					{loader}
					{this.props.containers.length !== 0
						? <List>{this.showList()}</List>
						: <Text style={[styles.sign_enc_prompt, { paddingTop: "50%", paddingLeft: 5, paddingRight: 5 }]}>
							Контейнеров нет. Создайте или импортируйте сертификат с закрытым ключом.</Text>
					}
					<Button transparent style={{ position: "absolute", bottom: 80, right: 30 }} onPressIn={() => {
						this.props.getProviders();
						this.clearSelectedCont();
					}}>
						<Image style={{ width: 60, height: 60 }} source={require("../../imgs/general/refresh.png")} />
					</Button>
					<Modal
						ref={ref => this.modals.basicModal = ref}
						style={styles.modal}
						position={"center"}
						swipeToClose={false}>
						<View style={{ width: "100%" }}>
							<Header
								style={{ backgroundColor: "#be3817", height: 45.7, paddingTop: 13 }}>
								<Title>
									<Text style={{
										color: "white",
										fontSize: 15
									}}>Удаление контейнера</Text>
								</Title>
							</Header>
							<ListWithSwitch styletext={{ fontSize: 13 }} text="Удалить по возможности вместе с сертификатом" value={this.state.deleteCert} changeValue={() => this.setState({ deleteCert: !this.state.deleteCert })} />
							<View style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap", justifyContent: "space-around", maxWidth: "100%" }}>
								<Button transparent style={styles.modalMain} onPress={() => this.modals.basicModal.close()}>
									<Text style={styles.buttonModal}>Отмена</Text>
								</Button>
								<Button transparent style={styles.modalMain} onPress={() => {
									this.deleteContainers();
								}}>
									<Text style={styles.buttonModal}>Применить</Text>
								</Button>
							</View>
						</View>
					</Modal>
					{this.state.selectedContainers.length && !this.state.loader ?
						<Footer style={{ position: "absolute", bottom: 0 }}>
							<FooterTab>
								<FooterButton disabled={this.state.selectedContainers.length !== 1} title="Сертификат" img={require("../../imgs/ios/question_cert.png")} nav={
									() => {
										this.setState({ loader: true });
										NativeModules.Wrap_Main.getCertInfoFromContainer(
											this.props.containers[this.state.selectedContainers]["unique"],
											(err, cert) => {
												this.setState({ loader: false });
												if (err) {
													console.log(err);
													showToast("В контейнере нет сертификата");
												} else {
													this.props.navigation.navigate("PropertiesCert", { cert: cert[0], isCertInContainers: true, containers: this.props.containers[this.state.selectedContainers]["fqcnA"] });
												}
											});
									}} />
								{/*<FooterButton disabled={this.state.selectedContainers.length !== 1} title="Экспорт" icon="ios-share-alt-outline" nav={() => /*this.uploadFile(this.props.containers, this.state.selectedContainers) null} />*/}
								<FooterButton title="Удалить" img={require("../../imgs/ios/delete.png")} nav={() => this.modals.basicModal.open()} />
							</FooterTab>
						</Footer> : null}
				</> : <View style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "90%",
					backgroundColor: "white"
				}}>
						<Spinner color={"#be3817"} />
					</View>}
			</Container>
		);
	}
}