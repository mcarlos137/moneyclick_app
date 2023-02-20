/*<ConfirmDialog
                        title={strings('common.dialogs.errorTitle')}
                        visible={this.state.errorConexionNotAction}
                        onTouchOutside={() =>
                            this.setState({ errorConexionNotAction: false })
                        }
                        positiveButton={{
                            title: strings('common.dialogs.buttonActionClose'),
                            onPress: () => this.setState({ errorConexionNotAction: false }),
                        }}
                    >
                        <View>
                            <Text>{strings('common.dialogs.networdError')}</Text>
                        </View>
                    </ConfirmDialog>*/


/*
import {
    View,
    ScrollView,
} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import strings from '../../../../i18n';
import appStyle from '../../../../../appStyles';
import colors from '../../../../constants/colors';
import styles from '../../styles';

const NetworkError = () => (
    <Dialog
        visible={this.state.errorNet}
        animationType={'fade'}
        onTouchOutside={() => this.setState({ errorNet: false })}
        dialogStyle={{ borderRadius: 10 }}
    >
        <View>
            <ScrollView>
                <Grid>
                    <Row>
                        <Col size={100}>
                            <Text>{strings('login.networkError')}</Text>
                            <Text />
                            <Grid>
                                <Row>
                                    <Col size={45}>
                                        <Button
                                            block
                                            style={appStyle.primaryButton}
                                            onPress={() => this._loginAsync()}
                                            title={strings('login.retry')}
                                        />
                                    </Col>
                                    <Col size={5} />
                                    <Col size={45}>
                                        <Button
                                            block
                                            style={appStyle.cancelButton}
                                            onPress={() =>
                                                this.setState({
                                                    errorNet: false,
                                                })
                                            }
                                        >
                                            <Text>{strings('login.cancel')}</Text>
                                        </Button>
                                    </Col>
                                </Row>
                            </Grid>
                        </Col>
                    </Row>
                </Grid>
            </ScrollView>
        </View>
    </Dialog>
);

export default NetworkError;*/