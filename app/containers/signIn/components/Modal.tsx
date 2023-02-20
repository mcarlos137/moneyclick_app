//PRINCIPAL
import React from 'react';
import {
    Button,
    Text,
    View,
    Modal,
    FlatList,
    TouchableOpacity
} from 'react-native';
import {
    ListItem,
} from '@rneui/themed'
//CONSTANTS
import countries from '../../../constants/countries'

const keyExtractor = (item) => (
    item.key !== undefined ? String(item.key) : String(item.value)
)

const renderItem = (item, onPressSelection) => (
    <ListItem
        key={item.index}
        style={{
            backgroundColor: '',
            paddingTop: 2,
            paddingBottom: 2
        }}>
        <TouchableOpacity
            onPress={() => onPressSelection(item.item)}
            style={{
                flexDirection: 'row'
            }}>
            <Text style={{
                flex: 8,
                fontSize: 18
            }}>
                {item.item.name}
            </Text>
            <Text style={{
                flex: 2,
                fontSize: 18
            }}>
                {'+' + item.item.value}
            </Text>
        </TouchableOpacity>
    </ListItem>
)

const getItemLayout = (data, index) => ({
    length: data.length,
    offset: data.length * index,
    index,
})

const Component = ({
    openModal,
    onPressClose,
    onPressSelection
}) => (
    <Modal
        animationType="slide"
        transparent={false}
        visible={openModal}
    >
        <View style={{

        }}>
            <Button
                onPress={onPressClose}
                title="Close"
            />
        </View>
        <FlatList
            data={countries.data}
            keyExtractor={keyExtractor}
            renderItem={item => renderItem(item, onPressSelection)}
            windowSize={51}
            initialNumToRender={200}
            removeClippedSubviews={true}
            maxToRenderPerBatch={100}
            updateCellsBatchingPeriod={10}
        //getItemLayout={getItemLayout}
        />
    </Modal>
);

export default React.memo(Component);
