/*<Dialog
    visible={this.state.viewDialog}
    animationType={'fade'}
    onTouchOutside={() => this.setState({ viewDialog: false })}
    dialogStyle={{ borderRadius: 10 }}
>
    <View style={{ borderRadius: 10 }}>
        <ScrollView style={{ borderRadius: 10 }}>
            <Grid>
                <Row>
                    <Col size={2.5} />
                    <Col size={95}>
                        {!this.state.endRequest && (
                            <View>
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: colors.PRIMARY_COLOR,
                                            fontSize: 18,
                                        }}
                                    >
                                        {this.state.messageBenefist}
                                    </Text>
                                </View>
                            </View>
                        )}
                        <Text />
                        <Grid>
                            {this.state.failRequest && (
                                <View style={[appStyles.centerContent, {}]}>
                                    <Text style={appStyles.operationError}>
                                        {strings('common.withdraw.modal.operationFail')}
                                    </Text>
                                </View>
                            )}
                            {!this.state.sendRequest && (
                                <Row>
                                    <Col size={45}>
                                        <Button
                                            style={appStyles.primaryButton}
                                            block
                                            onPress={() =>
                                                this.setStatusReceive('ACCEPTED')
                                            }
                                        >
                                            <Text style={{ color: 'white' }}>
                                                {strings('common.dialogs.yes')}
                                            </Text>
                                        </Button>
                                    </Col>
                                    <Col size={5} />
                                    <Col size={45}>
                                        <Button
                                            style={appStyles.cancelButton}
                                            block
                                            onPress={() =>
                                                this.setStatusReceive('REJECTED')
                                            }
                                        >
                                            <Text>{strings('common.dialogs.not')}</Text>
                                        </Button>
                                    </Col>
                                </Row>
                            )}
                            {this.state.viewSpinner && (
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: 'column',
                                        alignContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Spinner color={colors.PRIMARY_COLOR} />
                                </View>
                            )}
                            {this.state.endRequest && (
                                <View style={[appStyles.centerContent]}>
                                    <Icon
                                        name='checkcircleo'
                                        type='AntDesign'
                                        style={{
                                            fontSize: 40,
                                            color: colors.PRIMARY_COLOR,
                                            paddingBottom: 20,
                                        }}
                                    />
                                    <Text
                                        style={{
                                            color: colors.PRIMARY_COLOR,
                                            marginBottom: 10,
                                            fontSize: 17,
                                        }}
                                    >
                                        {strings(
                                            'common.withdraw.modal.messageOperationSuccess'
                                        )}
                                    </Text>
                                </View>
                            )}
                            {this.state.endRequest && (
                                <Row>
                                    <Col>
                                        <Button
                                            style={appStyles.primaryButton}
                                            block
                                            onPress={() => {
                                                this.setState({
                                                    viewDialog: false,
                                                    endRequest: false,
                                                    viewSpinner: false,
                                                    failRequest: false,
                                                });
                                                this.onRefresh();
                                            }}
                                        >
                                            <Text style={{ color: 'white' }}>
                                                {strings('common.dialogs.accept')}
                                            </Text>
                                        </Button>
                                    </Col>
                                </Row>
                            )}
                        </Grid>
                    </Col>
                    <Col size={2.5} />
                </Row>
            </Grid>
        </ScrollView>
    </View>
</Dialog>*/
