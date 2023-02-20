//PRINCIPAL
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, View, Text } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { compose } from 'redux'
//HOC
import { withColors } from '../../main/hoc';

//CONSTANTS
const SECTIONS = [
  {
    title: 'About MoneyClick',
    icon: '',
    data: [
      { question: '', answer: '' }
    ]
  },
  {
    title: 'About the Mobile Application',
    icon: '',
    data: [
      { question: '', answer: '' }
    ]
  },
  {
    title: 'About Businness Model',
    icon: '',
    data: [
      { question: '', answer: '' }
    ]
  },
  {
    title: 'About Bank Payments',
    icon: '',
    data: [
      { question: '', answer: '' }
    ]
  },
  {
    title: 'About Device Access',
    icon: '',
    data: [
      { question: '', answer: '' }
    ]
  }
]

const FAQsScreen = ({ navigation, route, colors }) => {

  //INITIAL STATES
  const [activeSections, setActiveSections] = useState([0])

  //EFFECTS
  useEffect(() => {
    console.log('FAQsScreen', route.params)
  }, []);

  //COMPONENTS
  const renderHeader = (section, expanded) => (
    <View
      style={{
        flexDirection: 'row',
        padding: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: colors.primaryBackground
      }}
    >
      <Text
        style={{
          color: colors.text,
          fontWeight: 'bold'
        }}
      >
        {section.title}
      </Text>
      <MaterialCommunityIcons
        name={expanded ? 'chevron-up' : 'chevron-down'}
        color={colors.icon}
        size={18}
      />
    </View >
  )

  const renderContent = (section) => (
    <View
      style={{
        marginBottom: 10,
        marginTop: 1
      }}
    >
      {/*data.map((item, key) => {
            return (
                <View
                    key={key}
                    style={{ flexDirection: 'row', marginBottom: 5 }}
                >
                    <View style={{ flex: 0.8 }}>
                        <Text style={{ paddingLeft: 10, color: colors.text }}>{item.operationName}</Text>
                    </View>
                    <View style={{ flex: 0.2 }}>
                        <Text style={{ color: colors.text }}>{item.amount}</Text>
                    </View>
                </View>
            );
        })*/}
    </View>
  )

  //PRINCIPAL RENDER
  return (
    <View style={{
      flex: 1
    }}>
      <ScrollView
        style={{
          marginTop: 20,
          width: Dimensions.get('window').width * 0.9,
          alignSelf: 'center',
        }}>
        <Accordion
          sections={SECTIONS}
          activeSections={activeSections}
          underlayColor={'transparent'}
          renderHeader={(section, i, isActive, sections) => (renderHeader(section, isActive))}
          renderContent={(section) => (renderContent(section))}
          onChange={(activeSections) => {
            setActiveSections(activeSections)
          }}
        />
      </ScrollView>
    </View >
  );
};

export default React.memo(compose(withColors)(FAQsScreen));

