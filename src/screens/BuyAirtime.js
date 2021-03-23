import React from 'react';
import {
    Dimensions, StyleSheet, ScrollView, Alert, BackHandler, Platform, AsyncStorage, StatusBar, KeyboardAvoidingView, TouchableOpacity, Linking, FlatList, List, View, ImageBackground,
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
const handleAndroidBackButton = callback => {
    BackHandler.addEventListener('hardwareBackPress', () => {
        callback();
        return true;
    });
};
const goodAlert = () => {
    Alert.alert(
        'Success',
        'Processing Your Payment Shortly',
        [
            { text: 'OK' },
        ],
        { cancelable: false }
    );
};
const badAlert = () => {
    Alert.alert(
        'Failed',
        'Please try again',
        [
            { text: 'OK' },
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
var t = require('tcomb-form-native');
var Form = t.form.Form;
const stylesheet = t.form.Form.stylesheet;

stylesheet.textbox.normal.borderWidth = 0;
stylesheet.textbox.error.borderWidth = 0;
stylesheet.textbox.normal.marginBottom = 0;
stylesheet.textbox.error.marginBottom = 0;
stylesheet.textboxView.normal.borderWidth = 0;
stylesheet.textboxView.error.borderWidth = 0;
stylesheet.textboxView.normal.borderRadius = 0;
stylesheet.textboxView.error.borderRadius = 0;
stylesheet.textboxView.normal.borderBottomWidth = 1;
stylesheet.textboxView.error.borderBottomWidth = 1;
stylesheet.textboxView.normal.marginBottom = 5;
stylesheet.textboxView.error.marginBottom = 5;
stylesheet.fieldset = {
    flexDirection: 'row'
};
// set defaults
var Bundles = t.enums({
    50: 'DailyData1GB',
    300: 'WeeklyData8G',
    500: 'WeeklyData15G',
    1000: 'MonthlyData25G',
    2000: 'MonthlyData40G',
    3000: 'MonthlyData70G',
    4000: 'MonthlyData120G',
    6000: 'MonthlyData210G',
    150: 'fisihour'
});
const FaibaNo = t.refinement(t.Number, FaibaNo => {
    const reg = /^(?:254)?(7(?:(?:[4][0-9])|(?:5[0-6])|(8[0-9]))[0-9]{6})$/;
    return reg.test(FaibaNo);
});
const MpesaNo = t.refinement(t.Number, MpesaNo => {
    const reg2 = /^(?:254)?(7(?:(?:[0-9][0-9])|(?:5[0-6])|(8[0-9]))[0-9]{6})$/;
    return reg2.test(MpesaNo);
});
FaibaNo.getValidationErrorMessage = function (value, path, context) {
    return 'Invalid! Has to be a valid Faiba Number. Please start with 254';
};
MpesaNo.getValidationErrorMessage = function (value, path, context) {
    return 'Invalid! Has to be a valid Mpesa Number. Please start with 254';
};
// here we are: define your domain model
var Person = t.struct({
    UseMyNumber: t.Boolean,        // a boolean
    FaibaNo: FaibaNo,              // a required string
    MpesaNo: MpesaNo,  // an optional string
    Amount: t.Number,              //
    //ChooseBundle: Bundles,               // a required number
});

var options = {
    auto: 'placeholders',
    fields: {
        FaibaNo: {
            label: 'Faiba Number', // <= label for the name field
            help: 'Start with 254',
            placeholder: '254'
        },
        MpesaNo: {
            label: 'Mpesa Number', // <= label for the name field
            help: 'Start with 254',
            placeholder: '254'
        },
        Amount: {
            label: 'Enter Amount', // <= label for the name field
            help: 'Enter desired Amount',
            placeholder: '100'
        },
        UseMyNumber: {
            label: 'Use my Number', // <= label for the name field
            help: 'Autoselect your number or enter another Faiba Number'
        },
    },
    stylesheet: stylesheet
};
export default class BuyAirtime extends React.Component {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.onChange = this.onChange.bind(this);
        this.state = {
            faiba: {
                faibano: 0,
                balance: 0
            },
            value: {
                FaibaNo: 0,
                UseMyNumber: true
            },
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
    resetForm() {
        this.setState({ value: { FaibaNo: FaibaNo, UseMyNumber: true, MpesaNo: 254 } })
    }
    handleSubmit = () => {
        try {
            const value = this._form.getValue();
            const { navigate } = this.props.navigation;
            // If the form is valid...
            if (value) {
                this.CheckConnectivity();
                this.setState({
                    loading: true
                });
                var credit = "t" + value.FaibaNo
                const data = {
                    phone: value.MpesaNo,
                    faibano: credit,
                    amount: value.Amount
                }
                // Serialize and post the data
                const json = JSON.stringify(data)
                console.log(json)
                fetch('http://193.164.133.24:81/faiba_bal/pay.php', {
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
                        if (response.Cstatus) {
                            if (response.Cstatus == true) {
                                this.resetForm();
                                goodAlert();
                                navigate("Home");
                            }
                            else if (response.Cstatus != true) {
                                this.resetForm();
                                badAlert();
                            }
                        }
                        else {
                            this.resetForm();
                            badAlert();
                        }
                    });
            }
            else {
                // Form validation error
                alert('Please fix the errors highlited and try again.');
            }
        }
        catch (error) {
            this.setState({
                loading: false
            })
            console.log("error " + error + this.state.faiba.faibano)
        }
    }
    componentDidMount() {
        AsyncStorage.getItem('faibano').then((FaibaNo) => {
            this.setState({ loading: false, value: { FaibaNo: FaibaNo, UseMyNumber: true, MpesaNo: 254 } })
        });
        console.log(this.state);
        this.CheckConnectivity();
        handleAndroidBackButton(exitAlert);
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
    onChange(value) {
        if (value.UseMyNumber == false) {
            this.setState({ value: { FaibaNo: 254, MpesaNo: 254, Amount: value.Amount } })
        }
        if (value.UseMyNumber == true) {
            AsyncStorage.getItem('faibano').then((FaibaNo) => {
                this.setState({ value: { FaibaNo: FaibaNo, MpesaNo: value.MpesaNo, Amount: value.Amount, UseMyNumber: true } })
            });
        }
    }
    render() {
        const { navigation } = this.props;
        return (
            <Block safe flex>
                <NavBar
                    title="Buy Airtime"
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
                        <Block flex style={{ marginBottom: theme.SIZES.BASE }}>
                            <KeyboardAvoidingView>
                                <Loader
                                    loading={this.state.loading} />
                                <Form style={styles.buttonText}
                                    ref={c => this._form = c}
                                    type={Person}
                                    value={this.state.value}
                                    onChange={this.onChange}
                                    options={options}
                                />
                                <View>
                                    <Block flex middle>
                                        <Button
                                            round
                                            color="#FE2472"
                                            onPress={this.handleSubmit}
                                        >
                                            Buy Airtime
              </Button>
                                    </Block>
                                </View>
                            </KeyboardAvoidingView>
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
