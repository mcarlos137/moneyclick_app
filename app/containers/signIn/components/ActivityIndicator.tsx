import React from "react";
import { ActivityIndicator } from 'react-native';

const Component = ({ isLoading }) => (
    <ActivityIndicator size="large" animating={isLoading} />
);

export default React.memo(Component);
