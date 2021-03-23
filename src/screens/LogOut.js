import React from 'react';
import {
    Dimensions, StyleSheet, ScrollView, Alert, Platform, TouchableOpacity, KeyboardAvoidingView,  BackHandler, Linking, FlatList, List, View, AsyncStorage, ImageBackground,
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import {
    Text, Block, Button, NavBar, Input, Icon
} from 'galio-framework';
import theme from '../theme';
import Constants from 'expo-constants';
const handleAndroidBackButton = callback => {
    BackHandler.addEventListener('hardwareBackPress', () => {
        callback();
        return true;
    });
};
const exitAlert = () => {
    Alert.alert(
        'Exit App',
        'Exiting the application?',
        [
            { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            { text: 'OK', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false }
    );
};
/**
 * Removes the event listener in order not to add a new one
 * every time the view component re-mounts
 */
const removeAndroidBackButtonHandler = () => {
    BackHandler.removeEventListener('hardwareBackPress', () => { });
}
export default class LogOut extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            faiba: {
                faibano: 0,
                balance: 0
            },
            balance: [],
            loading: false
        }
    }
    CheckConnectivity = () => {
        // For Android devices
        if (Platform.OS === "android") {
            try {
                NetInfo.fetch().then(state => {
                    if(state.type == "none" || state.isConnected == "false"){
                        this.setState({
                                        loading: false
                                    });
                                    Alert.alert(
                                        'Error',
                                        'Please make sure you are connected to the internet',
                                        [
                                            { text: 'OK' },
                                        ],
                                        { cancelable: false }
                                    );
                    }
                  });
            }
            catch (error) {
                this.setState({
                    loading: false
                });
            }
        }
    };
    async userLogout() {
        try {
            this.CheckConnectivity();
            await AsyncStorage.removeItem('faibano');
            const { navigate } = this.props.navigation;
            navigate("Login");
            Alert.alert(
                'Success',
                'Logged out Successfully',
                [
                    { text: 'OK' },
                ],
                { cancelable: false }
            );
        } catch (error) {
            navigate("Login");
            Alert.alert(
                'Error',
                'Error Logging Out',
                [
                    { text: 'OK' },
                ],
                { cancelable: false }
            );
            console.log('AsyncStorage error: ' + error.message);
        }
    }
    componentWillUnmount() {
        this.setState = {
            loading: false
        }
        removeAndroidBackButtonHandler();
    }
    componentDidMount() {
        AsyncStorage.getItem('faibano').then(() => {
            this.setState({ loading: false })
            this.userLogout();
        });
        this.CheckConnectivity();
        handleAndroidBackButton(exitAlert);
    }
    render() {
        const { navigation } = this.props;
        return (
            <Block safe flex>
                <NavBar
                    title="Log Out"
                    titleStyle={{ alignSelf: 'flex-start' }}
                    leftIconColor={theme.COLORS.MUTED}
                    left={(
                        <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
                            <Icon
                                name="menu"
                                family="feather"
                                size={theme.SIZES.BASE}
                                color={theme.COLORS.ICON}
                            />
                        </TouchableOpacity>
                    )}
                    style={Platform.OS === 'android' ? { marginTop: theme.SIZES.BASE } : null}
                />

                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <KeyboardAvoidingView>
                        <Block flex style={styles.news}>
                        </Block>
                    </KeyboardAvoidingView>
                </ScrollView>
            </Block>
        );
    }
}

const styles = StyleSheet.create({
    article: {
        marginTop: theme.SIZES.BASE * 1.75,
    },
    articleImage: {
        borderRadius: theme.SIZES.BASE / 2,
        height: theme.SIZES.BASE * 13.75,
    },
    news: {
        marginTop: theme.SIZES.BASE / 2,
        paddingBottom: theme.SIZES.BASE / 2,
        justifyContent: 'flex-start',
        paddingHorizontal: theme.SIZES.BASE,
    },
    button: {
        width: theme.SIZES.BASE * 2,
        borderColor: 'transparent',
    },
    author: {
        right: theme.SIZES.BASE,
        left: theme.SIZES.BASE,
        bottom: Constants.statusBarHeight,
        backgroundColor: theme.COLORS.WHITE,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        elevation: theme.SIZES.BASE / 2,
    },
    text: {
        fontWeight: '400',
        fontSize: theme.SIZES.FONT * 0.875,
        lineHeight: theme.SIZES.BASE * 1.25,
        letterSpacing: 0.3,
        marginBottom: theme.SIZES.BASE,
    },
});