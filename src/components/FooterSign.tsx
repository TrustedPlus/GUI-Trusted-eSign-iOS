import * as React from "react";
import {Footer, FooterTab, Button, Icon, Text} from "native-base";

export class FooterSign extends React.Component {
    render() {
        return(
            <Footer>
                <FooterTab>
                <Button vertical>
                    <Icon name="apps" />
                    <Text>Проверить</Text>
                </Button>
                <Button vertical>
                    <Icon name="camera" />
                    <Text>Подписать</Text>
                </Button>
                <Button vertical>
                    <Icon name="navigate" />
                    <Text>Отправить</Text>
                </Button>
                <Button vertical>
                    <Icon name="person" />
                    <Text >Закрыть</Text>
                </Button>
                </FooterTab>
            </Footer>
        );
    }
}