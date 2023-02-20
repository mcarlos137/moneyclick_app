//PRINCIPAL
import { Avatar } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { compose } from 'redux'
import { Rating } from 'react-native-rating-element';
//HOC
import { withColors, withHmacInterceptor, withUserName } from '../../main/hoc';
//TOOLS
import httpRequest from '../../tools/httpRequest';

const MoneyCallsMessagesScreen = ({ navigation, route, colors, userName, hmacInterceptor }) => {

    //INITIAL STATES
    const [data, setData] = useState<any[]>(route?.params?.selectedMoneyCallMessages !== undefined ? route.params.selectedMoneyCallMessages : [])

    //EFFECTS
    useEffect(() => {
        console.log('MoneyCallsMessagesScreen', route.params)
    }, []);

    return (
        <ScrollView
            style={{
                alignSelf: 'center',
                marginTop: 15
            }}
        >
            {data?.map((item, index) => {
                return (
                    <View
                        key={index}
                        style={{
                            flexDirection: item[3] === userName || (item[0] === 'PAY' && item[1].userName === userName) ? 'row' : 'row-reverse',
                            width: Dimensions.get('window').width * 0.9,
                            marginVertical: 5
                        }}
                    >
                        <Avatar
                            size={50}
                            rounded
                            source={{
                                uri: 'https://service8081.moneyclick.com/attachment/getUserFile/' + (item[0] === 'PAY' ? item[1].userName : item[3]),
                                method: 'GET',
                                headers: hmacInterceptor?.process(
                                    httpRequest.create(
                                        'https://service8081.moneyclick.com',
                                        '/attachment/getUserFile/' + (item[0] === 'PAY' ? item[1].userName : item[3]),
                                        'GET',
                                        null,
                                        false
                                    )).headers,
                            }}
                            overlayContainerStyle={{
                                backgroundColor: 'white',
                            }}
                        />
                        <View
                            style={{
                                marginLeft: 20,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row'
                                }}
                            >
                                {item[0] === 'PAY' &&
                                    <Rating
                                        rated={item[1].stars}
                                        totalCount={5}
                                        ratingColor="#F1C40F"
                                        ratingBackgroundColor="#d4d4d4"
                                        size={15}
                                        readonly // by default is false
                                        icon="ios-star"
                                        direction="row" // anyOf["row" (default), "row-reverse", "column", "column-reverse"]
                                    />}
                                <Text
                                    style={{
                                        fontSize: 8,
                                        color: colors.text,
                                        marginLeft: (item[0] !== 'PAY' ? 0 : 5)
                                    }}
                                >
                                    {(item[0] === 'PAY' ? item[1].timestamp : item[1])}
                                </Text>
                            </View>
                            <Text
                                style={{
                                    color: colors.text,
                                    fontWeight: 'bold',
                                }}
                            >
                                {(item[0] === 'PAY' ? item[1].comment : item[2])}
                            </Text>
                        </View>
                    </View>
                )
            })}
        </ScrollView>
    );
}

export default React.memo(compose(withColors, withUserName, withHmacInterceptor)(MoneyCallsMessagesScreen));

