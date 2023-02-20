//PRINCIPAL
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { StackActions } from "@react-navigation/native";
import { compose } from 'redux'
//STORES
import { store as balanceStore } from "../../main/stores/balance";
//HOOKS
import { getBalance } from "./hooks/getBalance";
import { getDebitCards } from "../../main/hooks/getDebitCards";
import { getInvestments } from "../../main/hooks/getInvestments";
//FUNCTIONS
import { getDetailedBalances } from "../../main/functions";
//COMPONENTS
import Body_Card from "./components/Body_Card";
import Body_Balance from "./components/Body_Balance";
import Body_DebitCard from "./components/Body_DebitCard";
import Body_Investment from "./components/Body_Investment";
import Body_GiftCard from "./components/Body_GiftCard";
import Button_Options from "../../main/components/Button_Options";
import BodyStack from "../../main/components/BodyStack"
import { withColors, withConfig, withUserName } from "../../main/hoc";

const WalletScreen = ({ navigation, route, colors, userName }) => {

  //HOOKS CALLS
  const [balance, currencies, currenciesOrder] = getBalance(userName, true)

  const { isLoading: isLoadingDebitCards, data: dataDebitCards } =
    getDebitCards(
      userName,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    )

  const { isLoading: isLoadingInvestments, data: dataInvestments } = getInvestments(userName)

  //EFFECTS
  useEffect(() => {
    console.log('WalletScreen', route.params)
  }, []);

  useEffect(() => {
    if (balance?.data && currencies?.data && currenciesOrder?.data) {
      let detailedBalances = getDetailedBalances(balance.data, currencies.data, currenciesOrder.data, 'ALL')
      balanceStore.dispatch(
        {
          type: 'SET_VALUES',
          payload: detailedBalances
        }
      )
    }
  }, [balance.data, currencies.data, currenciesOrder.data]);

  //MEMOS
  const detailedBalancesFiat = useMemo(() =>
    balance?.data &&
    currencies?.data &&
    currenciesOrder?.data &&
    getDetailedBalances(balance.data, currencies.data, currenciesOrder.data, 'FIAT'),
    [balance.data, currencies.data, currenciesOrder.data])

  const detailedBalancesCrypto = useMemo(() =>
    balance?.data &&
    currencies?.data &&
    currenciesOrder?.data &&
    getDetailedBalances(balance.data, currencies.data, currenciesOrder.data, 'CRYPTO'),
    [balance.data, currencies.data, currenciesOrder.data])

  //CALLBACKS
  const onPressNationalCurrencies = useCallback(() => {
    navigation.dispatch(StackActions.push('BalanceDetailsScreen', { ...route.params, balanceType: 'FIAT' }));
  }, [])

  const onPressCryptoCurrencies = useCallback(() => {
    navigation.dispatch(StackActions.push('BalanceDetailsScreen', { ...route.params, balanceType: 'CRYPTO' }));
  }, [])

  const onPressDebitCards = useCallback(() => {
    dataDebitCards.length > 0
      ?
      navigation.dispatch(StackActions.push('DebitCardsScreen', { ...route.params }))
      :
      navigation.dispatch(StackActions.push('DebitCardRequestScreen', { ...route.params }))
  }, [dataDebitCards])

  const onPressInvestments = useCallback(() => {
    dataInvestments !== undefined && dataInvestments.length > 0
      ?
      navigation.dispatch(StackActions.push('InvestmentScreen', { ...route.params }))
      :
      navigation.dispatch(StackActions.push('InvestmentRequestScreen', { ...route.params }))
  }, [dataInvestments])

  //PRINCIPAL RENDER
  return (
    <BodyStack name={'Wallet'} navigation={navigation} route={route}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              //REVIEW REFRESH CONTROL
              balance.refetch()
            }}
            tintColor={colors.background}
            colors={[colors.background]}
          />
        }
        style={{
          flexDirection: "column",
          alignContent: "center",
          alignSelf: "center",
          paddingLeft: 10,
          paddingRight: 10
        }}
        persistentScrollbar={true}
      >
        {true &&
          <Body_Card
            title={'National Currencies'}
            isLoading={balance.isLoading || currencies.isLoading || currenciesOrder.isLoading || balance.isFetching}
            onPress={onPressNationalCurrencies}
          >
            <Body_Balance
              data={detailedBalancesFiat}
            />
          </Body_Card>}
        {true &&
          <Body_Card
            title={'Crypto Currencies'}
            isLoading={balance.isLoading || currencies.isLoading || currenciesOrder.isLoading || balance.isFetching}
            onPress={onPressCryptoCurrencies}
          >
            <Body_Balance
              data={detailedBalancesCrypto}
            />
          </Body_Card>}
        {true &&
          <Body_Card
            title={'Debit / Credits Cards'}
            isLoading={isLoadingDebitCards}
            onPress={onPressDebitCards}
          >
            <Body_DebitCard
              data={dataDebitCards}
              icon={'credit-card-multiple'}
              noDataText={'Request a new card'}
            />
          </Body_Card>}
        {true &&
          <Body_Card
            title={'Investments'}
            isLoading={isLoadingInvestments}
            onPress={onPressInvestments}
          >
            <Body_Investment
              data={dataInvestments !== undefined ? dataInvestments : []}
              icon={'chart-box'}
              noDataText={'Ask for investment plan'}
            />
          </Body_Card>}
        {true &&
          <Body_GiftCard
            data={[]}
            navigation={navigation}
          />}
      </ScrollView>
      <Button_Options
        options={[
          {
            iconName: 'file-document-multiple-outline',
            onPress: () => {
              navigation.dispatch(StackActions.push('ChargesScreen', { ...route.params }))
            }
          },
          {
            iconName: 'account-tie',
            onPress: () => {
              navigation.dispatch(StackActions.push('CustomerSupportScreen', { ...route.params }))
            }
          },
          {
            iconName: 'help-circle-outline',
            onPress: () => {
              navigation.dispatch(StackActions.push('FAQsScreen', { ...route.params }))
            }
          },
        ]}
      />
    </BodyStack>
  );
};

export default React.memo(compose(withColors, withUserName, withConfig)(WalletScreen));
