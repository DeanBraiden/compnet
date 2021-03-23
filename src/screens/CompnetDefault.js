import React from 'react';
import {
    Dimensions, StyleSheet, ScrollView, Alert, Platform, TouchableOpacity,  BackHandler, Linking, FlatList, List, View, AsyncStorage, ImageBackground,
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { LinearGradient } from 'expo-linear-gradient';

// galio components
import {
    Text, Block, Button, NavBar, Input, Icon
} from 'galio-framework';
import theme from '../theme';
import Loader from '../helpers/loader';
import { Card } from "@paraboly/react-native-card";
const { width } = Dimensions.get('screen');
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
export default class CompnetDefault extends React.Component {
    constructor(props) {
        super(props)
        this._retrieveData = this._retrieveData.bind(this);
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
    _retrieveData = async () => {
        try {    
        const value = await AsyncStorage.getItem('faibano');
            this.CheckConnectivity();
            const data = {
                phone: value,
            }
            this.setState({
                faiba: {
                    faibano: value
                },
                balance: [],
                loading: true
            })
            // Serialize and post the data
            const json = JSON.stringify(data)
            try {
                fetch('http://193.164.133.24:81/faiba_bal/balancereq.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json'
                    },
                    body: json
                })
                    .then(response => response.json())
                    .then(response => {
                        this.setState({
                            loading: false
                        });
                        const balance = response;
                        this.setState({ balance });
                    });
            }
            catch (error) {
                this.setState({
                    loading: false
                });
            }
        }
        catch (error) {
            this.setState({
                loading: false
            })
            console.log("error " + error + this.state.faiba.faibano)
        }
    }


    componentWillUnmount() {
        this.setState = {
            value: {
                faibano: null
            },
            loading: false
        }
        removeAndroidBackButtonHandler();
    }
    componentDidMount() {
        AsyncStorage.getItem('faibano').then(() => {
            this.setState({ loading: false })
            this._retrieveData();
        });
        this.CheckConnectivity();
        handleAndroidBackButton(exitAlert);
    }
    renderArticles = () => {
        const { navigation } = this.props;
        const faibano = this.state.faiba.faibano;
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.articles}>
                <Block flex>
                    <Text style={styles.text_1}>Account Overview</Text>
                    <View style={styles.c1}>
                        <View style={styles.c2}>
                            <Text style={styles.gb_txt}>Balance:</Text>
                            <Text style={styles.curr_bal}>Click on + to refresh</Text>
                        </View>
                        <TouchableOpacity style={styles.fab} onPress={this._retrieveData}>
                            <Text
                                style={{
                                    fontSize: 24,
                                    fontWeight: "900",
                                    color: "#fff"
                                }}
                            >
                                +
              </Text>
                        </TouchableOpacity>
                    </View>
                </Block>
                <Block flex>
                    <Loader
                        loading={this.state.loading} />
                    <FlatList style={styles.FlatList}
                        data={this.state.balance}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) =>
                            <View style={styles.flatview}>
                                <Text style={styles.curr_bal2}>Account : {item.acc}</Text>
                                <Text style={styles.curr_bal2}>Balance : {item.bal}</Text>
                                <Text style={styles.curr_bal2}>Expiry Date: {item.exp}</Text>
                            </View>
                        }
                        keyExtractor={item => item.bal}
                    />
                </Block>
                <Block flex style={{ marginTop: theme.SIZES.BASE * 1.2 }}>
                    <Card
                        title="Buy Bundles"
                        defaultTitle=""
                        iconName="wifi"
                        iconType="Font Awesome"
                        iconColor="#fff"
                        titleColor="#000"
                        bottomRightColor="#fff"
                        iconBackgroundColor="#FE2472"
                        defaultContent=""
                        onPress={() => navigation.navigate("BuyBundles")}
                    />
                </Block>
                <Block flex style={{ marginTop: theme.SIZES.BASE * 1.2 }}>
                    <Card
                        title="Buy Airtime"
                        defaultTitle=""
                        iconName="phone"
                        iconType="Font Awesome"
                        defaultContent=""
                        iconColor="#fff"
                        titleColor="#000"
                        bottomRightColor="#fff"
                        iconBackgroundColor="#FE2472"
                        onPress={() => navigation.navigate("BuyAirtime")}
                    />
                </Block>
                <Block flex style={{ marginTop: theme.SIZES.BASE * 1.2 }}>
                    <Card
                        title="Buy Mifi"
                        defaultTitle=""
                        iconName="phone-iphone"
                        iconType="Font Awesome"
                        iconColor="#fff"
                        titleColor="#000"
                        bottomRightColor="#fff"
                        iconBackgroundColor="#FE2472"
                        defaultContent=""
                        onPress={() => Linking.openURL(`tel:${'254747356631'}`)}
                    />
                </Block>
                <Block flex style={{ marginTop: theme.SIZES.BASE * 1.2 }}>
                    <Card
                        title="Convert Airtime to Bundle"
                        defaultTitle=""
                        iconName="refresh"
                        iconType="Font Awesome"
                        iconColor="#fff"
                        titleColor="#000"
                        bottomRightColor="#fff"
                        iconBackgroundColor="#FE2472"
                        defaultContent=""
                        onPress={() => navigation.navigate("ConvertAirtime")}
                    />
                </Block>
            </ScrollView>
        )
    }
    render() {
        const { navigation } = this.props;
        return (
            <Block safe flex>
                <NavBar
                    title="Home"
                    left={(
                        <TouchableOpacity onPress={() => navigation.openDrawer()}>
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
                <ImageBackground source={require('../../assets/back.jpg')} style={styles.backgroundImage}
                >
                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                        {/* <Block style={styles.container}> */}
                        {/* Buttons examples using Button component */}
                        <Block flex style={{ marginBottom: theme.SIZES.BASE }}>
                            {this.renderArticles()}
                        </Block>
                    </ScrollView>
                </ImageBackground>
            </Block>
        );
    }
}

const styles = StyleSheet.create({
    flatview: {
        justifyContent: 'center',
        paddingTop: 15,
        width: width - theme.SIZES.BASE * 2,
        borderRadius: 12,
        backgroundColor: '#FE2472',
        marginTop: 20,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: "center",
        alignItems: "center",
        opacity: 1
    },
    FlatList: {
        borderRadius: 2,
    },
    curr_bal2: {
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 18.5,
        letterSpacing: 0.72,
        color: theme.COLORS.WHITE,
        marginLeft: 5,
        marginBottom: 5
    },
    email: {
        color: '#FFF'
    },
    articles: {
        width: width - theme.SIZES.BASE * 2,
        paddingVertical: theme.SIZES.BASE,
    },
    c4: {
        flexDirection: "row",
        marginLeft: 10,
        alignItems: "flex-start",
        marginTop: 38
    },
    text_2: {

        fontSize: 10,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 15.4,
        letterSpacing: 0.6,
        color: "#7b7f9e",
        marginTop: 6
    },
    btn: {
        width: 60,
        height: 61.3,
        borderRadius: 12,
        backgroundColor: "#f1f3f6",
        alignItems: "center",
        justifyContent: "center"
    },
    c3: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 20
    },
    gb_txt: {

        fontSize: 24,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 37,
        letterSpacing: 0,
        color: theme.COLORS.WHITE
    },
    curr_bal: {
        fontSize: 12,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 18.5,
        letterSpacing: 0.72,
        color: theme.COLORS.WHITE
    },
    fab: {
        width: 48,
        height: 48,
        backgroundColor: "#FE2472",
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 20,
        marginTop: 28
    },
    c1: {
        width: width - theme.SIZES.BASE * 2,
        height: 116,
        borderRadius: 12,
        backgroundColor: "#1232FF",
        marginTop: 20,
        flexDirection: "row",
    },
    c2: {
        flexDirection: "column",
        marginTop: 26,
        marginLeft: 25
    },
    text_1: {
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 24.7,
        letterSpacing: 0,
        color: "#3a4276",
        alignSelf: "flex-start",
        marginLeft: 30
    },
    container: {
        padding: 14,
        justifyContent: 'flex-start',
        backgroundColor: theme.COLORS.WHITE,
    },
    button: {
        marginBottom: 20,
    },
    cards: {
        flex: 1,
        backgroundColor: theme.COLORS.WHITE,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    card: {
        borderWidth: 0,
        backgroundColor: theme.COLORS.WHITE,
        width: width - theme.SIZES.BASE * 2,
        marginVertical: theme.SIZES.BASE * 0.875,
    },
    cardFooter: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginVertical: theme.SIZES.BASE / 2,
        paddingHorizontal: theme.SIZES.BASE,
        paddingVertical: theme.SIZES.BASE / 2,
        backgroundColor: theme.COLORS.TRANSPARENT,
    },
    cardNoRadius: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    cardAvatar: {
        width: theme.SIZES.BASE * 2.5,
        height: theme.SIZES.BASE * 2.5,
        borderRadius: theme.SIZES.BASE * 1.25,
    },
    cardTitle: {
        justifyContent: 'center',
        paddingLeft: theme.SIZES.BASE / 2,
    },
    cardImageContainer: {
        borderWidth: 0,
        overflow: 'hidden',
    },
    cardImageRadius: {
        borderRadius: theme.SIZES.BASE * 0.1875,
    },
    cardImage: {
        width: 'auto',
        height: theme.SIZES.BASE * 12.5,
    },
    cardRounded: {
        borderRadius: theme.SIZES.BASE * 0.5,
    },
    cardFull: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
    },
    cardGradient: {
        bottom: 0,
        left: 0,
        right: 0,
        height: 90,
        position: 'absolute',
        overflow: 'hidden',
        borderBottomRightRadius: theme.SIZES.BASE * 0.5,
        borderBottomLeftRadius: theme.SIZES.BASE * 0.5,
    },
});
