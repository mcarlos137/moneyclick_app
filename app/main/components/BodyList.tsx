import React from 'react';
import {
    View,
    RefreshControl,
    FlatList,
    Dimensions,
} from 'react-native';
import { compose } from 'redux';
//HOC
import { withColors } from '../hoc';
//COMPONENTS
import ViewInstructions from './ViewInstructions'

type BodyList_Props = {
    data: any[]
    renderItem: any
    keyExtractor: any
    instructions: any[]
    refreshing: any
    onRefresh: any
    colors: any
}

const Component = ({ data, renderItem, keyExtractor, instructions, refreshing, onRefresh, colors }: BodyList_Props) => {

    //PRINCIPAL RENDER
    return (
        <View style={{
            flex: 1
        }}>
            {
                data?.length === 0 && !refreshing
                    ?
                    <ViewInstructions
                        instructions={instructions}
                        type={'STEPS'}
                        width={Dimensions.get('window').width * 0.95}
                        marginTop={10}
                    />
                    :
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={keyExtractor}
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={13}
                        windowSize={13}
                        initialNumToRender={8}
                        persistentScrollbar={true}
                        //getItemLayout={getItemLayout}
                        style={{
                            marginBottom: 20,
                            alignSelf: 'center',
                            paddingLeft: 10,
                            paddingRight: 10,
                            minWidth: 100
                        }}
                        updateCellsBatchingPeriod={100}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor={colors.getRandomMain()}
                                colors={[colors.getRandomMain()]}
                            />
                        }
                    />
            }
        </View>
    )
};

export default React.memo(compose(withColors)(Component));