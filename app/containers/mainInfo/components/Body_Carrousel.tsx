import React from 'react';
import {
    View,
    Dimensions,
    ScrollView,
    Text,
    Platform,
    Image,
} from 'react-native';
import { Avatar } from '@rneui/themed';
//ACTIONS
import { getRequire } from '../../../main/functions';

//COMPONENTS
const ViewLiveStreaming = () => {
    return (
        <View
            style={{
                height: Dimensions.get('window').height + (Platform.OS === 'android' ? 50 : 0),
                width: Dimensions.get('window').width,
                backgroundColor: 'white',
                alignItems: 'center',
                paddingTop: 80,
                paddingLeft: 20,
                paddingRight: 20
            }}
        >
            <View
                style={{
                    width: Dimensions.get('window').width,
                    backgroundColor: '#068dc7',
                    alignItems: 'center',
                    padding: 10,
                }}
            >
                <Text
                    style={{
                        fontSize: 28,
                        color: 'white',
                        fontWeight: 'bold'
                    }}
                >
                    {'Wallet'}
                </Text>
            </View>
            {/*<Image
                style={{
                    width: Dimensions.get('window').width * 0.84,
                    height: Dimensions.get('window').width * 0.84 / 2,
                    marginTop: 20,
                    borderRadius: 10,
                }}
                source={getRequire('live_streaming_1')}
            />
            <Text
                style={{
                    fontSize: 16,
                    color: '#05375a',
                    marginTop: 10,
                    textAlign: 'justify',
                    fontWeight: 'bold',
                    paddingLeft: 10,
                    paddingRight: 10
                }}
            >
                {'Share video shorts and become a powerfull influencer in the community. Accept donations, payed calls and more...'}
            </Text>
            <View
                style={{
                    flexDirection: 'row',
                    marginTop: 30,
                    width: Dimensions.get('window').width * 0.84,
                }}
            >
                <View
                    style={{
                        flex: 0.5,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Image
                        style={{
                            width: Dimensions.get('window').width * 0.4,
                            height: Dimensions.get('window').width * 0.4 / 2,
                            borderRadius: 10,
                        }}
                        source={getRequire('live_streaming_2')}
                    />
                </View>
                <View
                    style={{
                        flex: 0.5,
                        justifyContent: 'center'
                    }}
                >
                    <Text
                        style={{
                            fontSize: 14,
                            color: '#05375a',
                            textAlign: 'justify',
                            fontWeight: 'bold',
                            marginLeft: 10
                        }}
                    >
                        {'Create your own live streamings and accept monthly subcriptions.'}
                    </Text>
                </View>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    width: Dimensions.get('window').width * 0.84,
                }}
            >
                <View
                    style={{
                        flex: 0.5,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Image
                        style={{
                            width: Dimensions.get('window').width * 0.4,
                            height: Dimensions.get('window').width * 0.4 / 2,
                            borderRadius: 10,
                        }}
                        source={getRequire('live_streaming_3')}
                    />
                </View>
                <View
                    style={{
                        flex: 0.5,
                        justifyContent: 'center'
                    }}
                >
                    <Text
                        style={{
                            fontSize: 14,
                            color: '#05375a',
                            textAlign: 'justify',
                            fontWeight: 'bold',
                            marginLeft: 10
                        }}
                    >
                        {'Bring people from other social networks and increase your social impact.'}
                    </Text>
                </View>
                    </View>*/}
        </View>
    )
}

const ViewMoneyCalls = () => {
    return (
        <View
            style={{
                height: Dimensions.get('window').height + (Platform.OS === 'android' ? 50 : 0),
                width: Dimensions.get('window').width,
                backgroundColor: 'white',
                alignItems: 'center',
                paddingTop: 80,
                paddingLeft: 20,
                paddingRight: 20

            }}
        >
            <View
                style={{
                    width: Dimensions.get('window').width,
                    backgroundColor: '#068dc7',
                    alignItems: 'center',
                    padding: 10,
                }}
            >
                <Text
                    style={{
                        fontSize: 28,
                        color: 'white',
                        fontWeight: 'bold'
                    }}
                >
                    {'Paid Calls & Free Chat'}
                </Text>
            </View>
            <Image
                style={{
                    width: Dimensions.get('window').width * 0.84,
                    height: Dimensions.get('window').width * 0.84 / 1.2,
                    marginTop: 20,
                    borderRadius: 10,
                }}
                source={getRequire('money_call_1')}
            />
            <Text
                style={{
                    fontSize: 16,
                    color: '#05375a',
                    marginTop: 10,
                    textAlign: 'justify',
                    fontWeight: 'bold',
                    paddingLeft: 10,
                    paddingRight: 10
                }}
            >
                {'Earn money by collecting from other users in audio/video paid calls.'}
            </Text>
            <View
                style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    width: Dimensions.get('window').width * 0.84,
                }}
            >
                <View
                    style={{
                        flex: 0.5,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Text
                        style={{
                            fontSize: 14,
                            color: '#05375a',
                            textAlign: 'justify',
                            fontWeight: 'bold',
                            marginRight: 10
                        }}
                    >
                        {'Use the free chat to talk with your contacts and invite them.'}
                    </Text>
                </View>
                <View
                    style={{
                        flex: 0.5,
                        justifyContent: 'center'
                    }}
                >
                    <Image
                        style={{
                            width: Dimensions.get('window').width * 0.4,
                            height: Dimensions.get('window').width * 0.4 / 2,
                            borderRadius: 10,
                        }}
                        source={getRequire('money_call_2')}
                    />
                </View>
            </View>
        </View>
    )
}

const ViewMoneyMarkets = () => {
    return (
        <View
            style={{
                height: Dimensions.get('window').height + (Platform.OS === 'android' ? 50 : 0),
                width: Dimensions.get('window').width,
                backgroundColor: 'white',
                alignItems: 'center',
                paddingTop: 80,
                paddingLeft: 20,
                paddingRight: 20
            }}
        >
            <View
                style={{
                    width: Dimensions.get('window').width,
                    backgroundColor: '#068dc7',
                    alignItems: 'center',
                    padding: 10,
                }}
            >
                <Text
                    style={{
                        fontSize: 28,
                        color: 'white',
                        fontWeight: 'bold'
                    }}
                >
                    {'P2P & Exchange market'}
                </Text>
            </View>
            <Image
                style={{
                    width: Dimensions.get('window').width * 0.84,
                    height: Dimensions.get('window').width * 0.84 / 2,
                    marginTop: 20,
                    borderRadius: 10,
                }}
                source={getRequire('exchange')}
            />
            <Text
                style={{
                    fontSize: 16,
                    color: '#05375a',
                    marginTop: 10,
                    textAlign: 'justify',
                    paddingLeft: 10,
                    paddingRight: 10,
                    fontWeight: 'bold'
                }}
            >
                {'Create your own buy/sell exchange orders or execute existent for multiple stocks'}
            </Text>
            <Image
                style={{
                    width: Dimensions.get('window').width * 0.84,
                    height: Dimensions.get('window').width * 0.84 / 2,
                    marginTop: 40,
                    borderRadius: 10,
                }}
                source={getRequire('p2p')}
            />
            <Text
                style={{
                    fontSize: 16,
                    color: '#05375a',
                    marginTop: 10,
                    textAlign: 'justify',
                    paddingLeft: 10,
                    paddingRight: 10,
                    fontWeight: 'bold'
                }}
            >
                {'Create your own connections with other users and exchange CRYPTO to FIAT or FIAT to CRYPTO'}
            </Text>
        </View>
    )
}

const ViewCommunity = () => {
    return (
        <View
            style={{
                height: Dimensions.get('window').height + (Platform.OS === 'android' ? 50 : 0),
                width: Dimensions.get('window').width,
                backgroundColor: 'white',
                alignItems: 'center',
                paddingTop: 80,
                paddingLeft: 20,
                paddingRight: 20
            }}
        >
            <View
                style={{
                    width: Dimensions.get('window').width,
                    backgroundColor: '#068dc7',
                    alignItems: 'center',
                    padding: 10,
                }}
            >
                <Text
                    style={{
                        fontSize: 28,
                        color: 'white',
                        fontWeight: 'bold'
                    }}
                >
                    {'Community & Support'}
                </Text>
            </View>
        </View>
    )
}

const ViewWallet = () => {
    return (
        <View
            style={{
                height: Dimensions.get('window').height + (Platform.OS === 'android' ? 50 : 0),
                width: Dimensions.get('window').width,
                backgroundColor: 'white',
                alignItems: 'center',
                paddingTop: 80,
                paddingLeft: 20,
                paddingRight: 20
            }}
        >
            <View
                style={{
                    width: Dimensions.get('window').width,
                    backgroundColor: '#068dc7',
                    alignItems: 'center',
                    padding: 10,
                }}
            >
                <Text
                    style={{
                        fontSize: 28,
                        color: 'white',
                        fontWeight: 'bold'
                    }}
                >
                    {'Wallet & KK Token'}
                </Text>
            </View>
            <View
                style={{
                    width: Dimensions.get('window').width * 0.84,
                }}
            >
                <View
                    style={{
                        marginTop: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Avatar
                        size='large'
                        rounded
                        source={getRequire('wallet_2')}
                    />
                    <Text
                        style={{
                            fontSize: 16,
                            color: '#05375a',
                            textAlign: 'justify',
                            fontWeight: 'bold',
                            marginLeft: 10,
                            width: Dimensions.get('window').width * 0.6
                        }}
                    >
                        {'Take control of your digital assets and pay for your needs.'}
                    </Text>
                </View>
                <View
                    style={{
                        marginTop: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Avatar
                        size='large'
                        rounded
                        source={getRequire('wallet_1')}
                    />
                    <Text
                        style={{
                            fontSize: 16,
                            color: '#05375a',
                            textAlign: 'justify',
                            fontWeight: 'bold',
                            marginLeft: 10,
                            width: Dimensions.get('window').width * 0.6
                        }}
                    >
                        {'Request your debit cards and sync your payments.'}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 20,
                    }}
                >
                    <Avatar
                        size='large'
                        rounded
                        source={getRequire('kkt')}
                    />
                    <Text
                        style={{
                            fontSize: 16,
                            color: '#05375a',
                            textAlign: 'justify',
                            fontWeight: 'bold',
                            marginLeft: 10,
                            width: Dimensions.get('window').width * 0.6
                        }}
                    >
                        {'Get KKT token and obtain multiples advantages on trading and earning rewards.'}
                    </Text>
                </View>
                <View
                    style={{
                        marginTop: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Avatar
                        size='large'
                        rounded
                        source={getRequire('wallet_3')}
                    />
                    <Text
                        style={{
                            fontSize: 16,
                            color: '#05375a',
                            textAlign: 'justify',
                            fontWeight: 'bold',
                            marginLeft: 10,
                            width: Dimensions.get('window').width * 0.6
                        }}
                    >
                        {'Buy, send and redeem gift cards of most popular platforms.'}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 20,
                    }}
                >
                    <Avatar
                        size='large'
                        rounded
                        source={getRequire('wallet_6')}
                    />
                    <Text
                        style={{
                            fontSize: 16,
                            color: '#05375a',
                            textAlign: 'justify',
                            fontWeight: 'bold',
                            marginLeft: 10,
                            width: Dimensions.get('window').width * 0.6
                        }}
                    >
                        {'Select the investment plan that satisfied your needs.'}
                    </Text>
                </View>
            </View>
        </View>
    )
}

const Component = ({
    scrollViewRef,
    onScroll
}) => {

    //PRINCIPAL RENDER
    return (
        <>
            <ScrollView
                ref={scrollViewRef}
                horizontal={true}
                persistentScrollbar={false}
                pagingEnabled={true}
                style={{
                    width: Dimensions.get('window').width,
                    alignSelf: 'center',
                }}
                scrollEventThrottle={16}
                onScroll={onScroll}
            >
                <ViewWallet />
                <ViewMoneyMarkets />
                <ViewMoneyCalls />
                <ViewCommunity />                
            </ScrollView>
        </>
    )
};

export default React.memo(Component);
