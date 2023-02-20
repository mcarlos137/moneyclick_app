import React, { ReactNode } from "react";
import {
  TouchableOpacity,
  Dimensions,
  View,
  Text,
  ActivityIndicator,
  GestureResponderEvent
} from "react-native";
import { compose } from "redux";
//HOC
import { withColors } from "../../../main/hoc";

type Body_Card_Props = {
  children: ReactNode
  title: string
  isLoading: boolean
  onPress: (event: GestureResponderEvent) => void
  colors: any
}

const Component = ({
  children,
  title,
  isLoading,
  onPress,
  colors
}: Body_Card_Props) => {
  
  //PRINCIPAL RENDER  
  return (
    <>
      <View
        style={{
          padding: 20,
          borderRadius: 20,
          width: Dimensions.get('window').width * 0.9,
          marginBottom: 10,
          backgroundColor: colors.primaryBackground,
        }}
      >
        <TouchableOpacity
          onPress={onPress}
          disabled={isLoading}
        >
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontWeight: "bold",
                fontSize: Dimensions.get("window").width * 0.045,
              }}
            >
              {title}
            </Text>
            {isLoading && (
              <ActivityIndicator
                size="large"
                animating={isLoading}
                color={colors.getRandomMain()}
                style={{ marginTop: 20 }}
              />
            )}
            {children}
          </View>
        </TouchableOpacity>
      </View>
    </>
  )
};

export default React.memo(compose(withColors)(Component));
