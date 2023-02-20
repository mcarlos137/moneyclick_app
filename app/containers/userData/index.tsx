//PRINCIPAL
import { StackActions } from '@react-navigation/native';
import { compose } from 'redux';
import { Avatar } from '@rneui/themed';
import React, { Fragment, useMemo } from 'react';
import { Dimensions, StatusBar, Text, View, ScrollView, TouchableOpacity, processColor } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//COMPONENTS
import BodyStack from '../../main/components/BodyStack'
import Button_Options from '../../main/components/Button_Options'
import Body_SectionHeader from './components/Boby_SectionHeader'
//import Boby_SectionContentDigitalBusiness from './components/Boby_SectionContentDigitalBusiness'
import Boby_SectionContent from './components/Boby_SectionContent'
import Boby_SectionContentVerifiedInfo from './components/Boby_SectionContentVerifiedInfo';
//HOC
import { withColors, withHmacInterceptor, withUserName } from '../../main/hoc';
//TOOLS
import httpRequest from '../../tools/httpRequest';
//HOOKS
import { getFinancialOverview } from '../../main/hooks/getFinancialOverview';
import { getConfig } from '../../main/hooks/getConfig';
//CONSTANTS
import { months } from '../../constants/time';

const UserDataScreen = ({ navigation, route, colors, userName, hmacInterceptor }) => {

  //VARIABLES
  var svg = null

  //HOOKS CALLS
  const { isLoading: isLoadingFinancialOverview, data: dataFinancialOverview, error: errorFinancialOverview } =
    getFinancialOverview(userName)

  const { isLoading: isLoadingGetConfig, data: dataGetConfig, error: errorGetConfig } =
    getConfig(userName)

  //MEMOS
  const dataDigitalBusiness = useMemo(() => {
    if (dataFinancialOverview.length === 0) {
      return {}
    }
    const type = 'ALL'
    let earningsData: any[] = []
    let spendsData: any[] = []
    let datesData: any[] = []
    let usdEstimatedBalance = 0
    let partialData: any = {}
    let currentDate = new Date()
    let i = 0
    while (i < 9) {
      let monthPeriod = months[currentDate.getMonth()] + '-' + currentDate.getFullYear().toString().substring(2)
      partialData[monthPeriod] = [0, 0]
      currentDate.setMonth(currentDate.getMonth() - 1);
      i++
    }
    dataFinancialOverview.map((value, key) => {
      if (type !== 'ALL' && value.type !== type) return
      value.values.map((v, k) => {
        let date = new Date(Date.parse(v.timestamp))
        let monthPeriod = months[date.getMonth()] + '-' + date.getFullYear().toString().substring(2)
        usdEstimatedBalance = usdEstimatedBalance + v.earnings - v.spends
        partialData[monthPeriod][0] = partialData[monthPeriod][0] + v.earnings
        partialData[monthPeriod][1] = partialData[monthPeriod][1] + v.spends
      })
    })
    Object.keys(partialData).reverse().forEach((key) => {
      if (partialData[key][0] !== 0 || partialData[key][1] !== 0) {
        earningsData.push(partialData[key][0])
        spendsData.push(partialData[key][1])
        datesData.push(key)
      }
    });
    return {
      type: 'DIGITAL_BUSINESS',
      name: 'Digital Business',
      data: {
        dataSets: [{
          values: spendsData,
          label: 'Spends',
          config: {
            drawValues: true,
            colors: [processColor('red')],
            valueTextColor: processColor(colors.text),
          }
        }, {
          values: earningsData,
          label: 'Earnings USD ($)',
          config: {
            drawValues: true,
            colors: [processColor('green')],
            valueTextColor: processColor(colors.text),
          }
        }],
        config: {
          barWidth: 0.3,
          group: {
            fromX: -0.5,
            groupSpace: 0.2,
            barSpace: 0.1,
          },
        }
      },
      dataShow: 'CHART',
      xAxis: datesData,
      usdEstimatedBalance: usdEstimatedBalance,
      img: 'MY_DIGITAL_BUSINESS',
      noDataText: 'Create a new MoneyCall, Podcast, TV show, Fan Content or Live Streaming',
      target: 'DigitalBusinessScreen'
    }
  }, [dataFinancialOverview])

  const dataAdditionalInfo = useMemo(() => {
    return [
      { name: 'description', text: 'description', canEdit: true, value: dataGetConfig?.description === undefined ? '' : dataGetConfig.description, type: 'TEXT', add: dataGetConfig?.description === undefined, changed: false },
      { name: 'web', text: 'web', canEdit: true, value: dataGetConfig?.web === undefined ? '' : dataGetConfig.web, type: 'TEXT_LINK', add: dataGetConfig?.web === undefined, changed: false, info: 'Enter your web site URL.' },
      { name: 'instagram', text: 'instagram', canEdit: true, value: dataGetConfig?.instagram === undefined ? '' : dataGetConfig.instagram, type: 'TEXT_LINK', add: dataGetConfig?.instagram === undefined, changed: false, info: 'Enter your Instagram account name' },
      { name: 'twitter', text: 'twitter', canEdit: true, value: dataGetConfig?.twitter === undefined ? '' : dataGetConfig.twitter, type: 'TEXT_LINK', add: dataGetConfig?.twitter === undefined, changed: false, info: 'Enter your Twitter account name' },
      { name: 'facebook', text: 'facebook', canEdit: true, value: dataGetConfig?.facebook === undefined ? '' : dataGetConfig.facebook, type: 'TEXT_LINK', add: dataGetConfig?.facebook === undefined, changed: false, info: 'Enter your Facebook account name' },
      { name: 'youtube', text: 'youtube', canEdit: true, value: dataGetConfig?.youtube === undefined ? '' : dataGetConfig.youtube, type: 'TEXT_LINK', add: dataGetConfig?.youtube === undefined, changed: false, info: 'Enter your Youtube channel name' },
      { name: 'tiktok', text: 'tiktok', canEdit: true, value: dataGetConfig?.tiktok === undefined ? '' : dataGetConfig.tiktok, type: 'TEXT_LINK', add: dataGetConfig?.tiktok === undefined, changed: false, info: 'Enter your Tik Tok account name' },
      { name: 'pinterest', text: 'pinterest', canEdit: true, value: dataGetConfig?.pinterest === undefined ? '' : dataGetConfig.pinterest, type: 'TEXT_LINK', add: dataGetConfig?.pinterest === undefined, changed: false, info: 'Enter your Pinterest account name' },
      { name: 'snapchat', text: 'snapchat', canEdit: true, value: dataGetConfig?.snapchat === undefined ? '' : dataGetConfig.snapchat, type: 'TEXT_LINK', add: dataGetConfig?.snapchat === undefined, changed: false, info: 'Enter your Snapchat account name' },
      { name: 'onlyFans', text: 'onlyFans', canEdit: true, value: dataGetConfig?.onlyFans === undefined ? '' : dataGetConfig.onlyFans, type: 'TEXT_LINK', add: dataGetConfig?.onlyFans === undefined, changed: false, info: 'Enter your Only Fans account name' },
    ]
  }, [dataGetConfig])

  const dataSubscriptionsAndCalls = useMemo(() => {
    return [
      { name: 'moneyCallRate', text: 'calls', canEdit: true, value: dataGetConfig?.moneyCallRate === undefined ? '0.00' : dataGetConfig.moneyCallRate, type: 'NUMBER', decimals: 2, suffix: 'USD/min', add: dataGetConfig?.moneyCallRate === undefined, changed: false, info: 'Change your calls rate per minute. Other users could not schedule calls for less than this amount with you' },
      { name: 'premiumPrice', text: 'premium subs', canEdit: true, value: dataGetConfig?.premiumPrice === undefined ? '0.00' : dataGetConfig.premiumPrice, type: 'NUMBER', decimals: 2, suffix: 'USD/month', add: dataGetConfig?.premiumPrice === undefined, changed: false, info: 'Change your premium subscription price to an amount bigger than 0.00 and it will be activated. Only subscribers older than 18 could see your premium gallery.' },
      { name: 'premiumDescription', text: 'premium description', canEdit: true, value: dataGetConfig?.premiumDescription === undefined ? '' : dataGetConfig.premiumDescription, type: 'TEXT', add: dataGetConfig?.premiumDescription === undefined, changed: false, info: 'Change your premium subscription description.' },
    ]
  }, [dataGetConfig])

  const dataVerifiedInfo = useMemo(() => {
    return [
      { name: 'A', text: 'email verification', canEdit: false, value: dataGetConfig?.verifications?.A, type: 'VERIFICATION', add: dataGetConfig?.phone === undefined, changed: false },
      { name: 'B', text: 'phone verification', canEdit: false, value: dataGetConfig?.verifications?.B, type: 'VERIFICATION', add: dataGetConfig?.email === undefined, changed: false },
      { name: 'C', text: 'data verification - bank operations', canEdit: false, value: dataGetConfig?.verifications?.C, type: 'VERIFICATION', add: dataGetConfig?.firstName === undefined, changed: false },

    ]
  }, [dataGetConfig])

  //CONSTANTS
  const SECTIONS = [
    /*{
      type: 'digitalBusiness',
      title: 'Digital Business',
      sectionContent: <Boby_SectionContentDigitalBusiness data={dataDigitalBusiness} />,
      canEdit: false,
      visible: true,
      buttons:
        [
          {
            type: 'data',
            title: 'Details',
            data: [],
            onPress: () => {
              navigation.dispatch(StackActions.push('DigitalBusinessScreen', { ...route.params }))
            }
          },
        ]
    },*/
    {
      type: 'verifiedInfo',
      title: 'Verified Info',
      sectionContent: <Boby_SectionContentVerifiedInfo data={dataVerifiedInfo} />,
      canEdit: false,
      visible: dataGetConfig?.verifications?.A !== undefined || dataGetConfig?.verifications?.B !== undefined || dataGetConfig?.verifications?.C !== undefined,
    },
    {
      type: 'additionalInfo',
      title: 'Additional Info',
      sectionContent: <Boby_SectionContent data={dataAdditionalInfo} />,
      canEdit: true,
      visible: true,
    },
    {
      type: 'subscriptionsAndCalls',
      title: 'Subscriptions & Calls',
      sectionContent: <Boby_SectionContent data={dataSubscriptionsAndCalls} />,
      canEdit: true,
      visible: true,
    },
  ]

  return (
    <BodyStack name={'UserData'} navigation={navigation} route={route}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'center',
          marginTop: 10,
          width: Dimensions.get('window').width * 0.9,
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <TouchableOpacity
            onPress={() => {
              //actionSheetDocumentRefState.current?.setModalVisible(true);
            }}
          >
            <Avatar
              rounded
              size={100}
              source={{
                uri: 'https://service8081.moneyclick.com/attachment/getUserFile/' + userName,
                method: 'GET',
                headers: hmacInterceptor?.process(
                  httpRequest.create(
                    'https://service8081.moneyclick.com',
                    '/attachment/getUserFile/' + userName,
                    'GET',
                    null,
                    false
                  )).headers,
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <QRCode
            //value={getQR(formState)}
            value={'Epa'}
            color={colors.icon}
            backgroundColor={colors.primaryBackground}
            size={110}
            getRef={(c) => {
              svg = c
            }}
            quietZone={10}
            logoMargin={10}
            logoBackgroundColor='white'
          />
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <TouchableOpacity
            style={{
              borderColor: 'gray',
              borderWidth: 1,
              padding: 5,
              borderRadius: 5,
              flexDirection: 'row',
              justifyContent: 'center',
              alignSelf: 'center'
            }}
            onPress={() => {
              //shareSVG(svgState)
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontWeight: 'normal',
                fontSize: 11
              }}
            >
              Share
            </Text>
            <MaterialCommunityIcons
              name={'share-variant'}
              color={colors.icon}
              size={15}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginTop: 7,
              borderColor: 'gray',
              borderWidth: 1,
              padding: 5,
              borderRadius: 5,
              flexDirection: 'row',
              justifyContent: 'center',
              alignSelf: 'center'
            }}
            onPress={() => {
              navigation.dispatch(StackActions.push('UserDataGalleryScreen', { ...route.params, selectedUserName: userName, selectedGalleryType: 'gallery' }))
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontWeight: 'normal',
                fontSize: 11
              }}
            >
              Gallery
            </Text>
            <MaterialCommunityIcons
              name={'folder-multiple-image'}
              color={colors.icon}
              size={15}
              style={{
                marginLeft: 3
              }}
            />
          </TouchableOpacity>
          {
            //allowPremiumGallery(formState) 
            true &&
            <TouchableOpacity
              style={{
                marginTop: 7,
                borderColor: colors.getRandomMain(),
                borderWidth: 1,
                padding: 5,
                borderRadius: 5,
                flexDirection: 'row',
                justifyContent: 'center',
                alignSelf: 'center',
                flexWrap: 'wrap',
                maxWidth: 100,
                alignItems: 'center'
              }}
              onPress={() => {
                navigation.dispatch(StackActions.push('UserDataGalleryScreen', { ...route.params, selectedUserName: userName, selectedGalleryType: 'premiumGallery' }))
              }}
            >
              <Text
                style={{
                  color: colors.getRandomMain(),
                  fontSize: 11
                }}
              >
                Premium
              </Text>
              <MaterialCommunityIcons
                name={'view-gallery-outline'}
                color={colors.getRandomMain()}
                size={15}
                style={{
                  marginLeft: 3
                }}
              />
            </TouchableOpacity>}
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 5
        }}
      >
        <Text
          style={{
            marginRight: 5,
            fontWeight: 'bold',
            color: colors.text
          }}
        >
          @{'mcarlos'}
        </Text>
        <Text
          style={{
            marginRight: 7,
            color: colors.text
          }}
        >
          |
        </Text>
        <Text
          style={{
            marginRight: 7,
            color: colors.text
          }}
        >
          {33} subscribers
        </Text>
        <Text
          style={{
            color: colors.text
          }}
        >
          {'Carlos'} {'Molina'}
        </Text>
      </View>


      <ScrollView>
        {
          //JSON.stringify(formState) !== JSON.stringify({}) && 
          SECTIONS.map((item, index) => {
            if (!item.visible) {
              return null
            }
            return (
              <Fragment
                key={index}
              >
                <Body_SectionHeader
                  title={item.title}
                  isEditing={false}
                  type={item.type}
                  canEdit={item.canEdit}
                  buttons={item.buttons}
                />
                {item.sectionContent}
              </Fragment>
            )
          })}
      </ScrollView>
      <Button_Options />
    </BodyStack>
  );
};

export default React.memo(compose(withColors, withUserName, withHmacInterceptor)(UserDataScreen));
