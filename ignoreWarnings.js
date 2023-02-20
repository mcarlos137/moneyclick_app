import { LogBox } from "react-native";

if (__DEV__) {
    const ignoreWarns = [
        "EventEmitter.removeListener",
        "[fuego-swr-keys-from-collection-path]",
        "Setting a timer for a long period of time",
        "ViewPropTypes will be removed from React Native",
        "AsyncStorage has been extracted from react-native",
        "exported from 'deprecated-react-native-prop-types'.",
        "Non-serializable values were found in the navigation state.",
        "VirtualizedLists should never be nested inside plain ScrollViews",
        "Require cycle: node_modules/rn-fetch-blob/index.js",
        "Module PhotoEditor requires main queue setup since it overrides `init` but doesn't implement `requiresMainQueueSetup`. In a future release React Native will default to initializing all native modules on a background thread unless explicitly opted-out of."
    ];

    const warn = console.warn;
    console.warn = (...arg) => {
        for (const warning of ignoreWarns) {
            if (arg[0].startsWith(warning)) {
                return;
            }
        }
        warn(...arg);
    };

    LogBox.ignoreLogs(ignoreWarns);
}
