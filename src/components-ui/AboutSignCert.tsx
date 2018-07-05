import * as React from "react";
import { Container, List, Content } from "native-base";
import { Headers } from "../components/Headers";
import { styles } from "../styles";
import { ListForCert } from "../components/ListForCert";

interface AboutSignCertProps {
   navigation: any;
   goBack: void;
}

export class AboutSignCert extends React.Component<AboutSignCertProps> {

   static navigationOptions = {
      header: null
   };

   showList(cert) {
      return (cert.map((cert) =>
         <List style={{ paddingTop: 10, paddingBottom: 30 }}>
            <ListForCert title="Статус" value={cert.status ? "подпись действительна" : "подпись не действительна"} />
            <ListForCert title="Время подписи:" value={cert.signingTime} />
            <ListForCert title="Алгоритм подписи:" value={cert.signatureAlgorithm} />
            <ListForCert title="Владелец сертификата" value={cert.subjectName.match(/2.5.4.3=[^\/]{1,}/)[0].replace("2.5.4.3=", "")} />
            <ListForCert title="Кем выдан" value={cert.issuerName.match(/2.5.4.3=[^\/]{1,}/)[0].replace("2.5.4.3=", "")} />
            <ListForCert title="Годен до:" value={cert.notAfter} />
         </List>
      ));
   }

   render() {
      const { navigate, goBack } = this.props.navigation;
      const { cert } = this.props.navigation.state.params.cert;
      console.log(cert);
      return (
         <Container style={styles.container}>
            <Headers title="Свойства подписи" goBack={() => goBack()} />
            <Content>
               {this.showList(cert)}
            </Content>
         </Container>
      );
   }
}