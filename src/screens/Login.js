import React from 'react';
import {
  Alert, Dimensions, KeyboardAvoidingView, StyleSheet, Platform, ImageBackground, AsyncStorage, ScrollView, BackHandler
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
// galio component
import {
  Block, Button, Input, NavBar, Text,
} from 'galio-framework';
import theme from '../theme';
import Loader from '../helpers/loader';
const { height, width } = Dimensions.get('window');
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
const ContactNo = t.refinement(t.Number, ContactNo => {
  const reg2 = /^(?:254)?(7(?:(?:[0-9][0-9])|(?:5[0-6])|(8[0-9]))[0-9]{6})$/;
  return reg2.test(ContactNo);
});
FaibaNo.getValidationErrorMessage = function (value, path, context) {
  return 'Invalid! Has to be a valid Faiba Number. Please start with 254';
};
ContactNo.getValidationErrorMessage = function (value, path, context) {
  return 'Invalid! Has to be a valid Phone Number. Please start with 254';
};
const User = t.struct({
  FaibaNo: FaibaNo,
})

var options = {
  auto: 'placeholders',
  fields: {
    FaibaNo: {
      label: 'Faiba Number', // <= label for the name field
      help: 'Start with 254',
      placeholder: '254'
    },
    ContactNo: {
      label: 'Contact Number', // <= label for the name field
      help: 'Start with 254',
      placeholder: '254'
    },
    Name: {
      label: 'Your Name', // <= label for the name field
      help: ''
    },
  },
  stylesheet: stylesheet
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
const handleAndroidBackButton = callback => {
  BackHandler.addEventListener('hardwareBackPress', () => {
    callback();
    return true;
  });
};
/**
 * Removes the event listener in order not to add a new one
 * every time the view component re-mounts
 */
const removeAndroidBackButtonHandler = () => {
  BackHandler.removeEventListener('hardwareBackPress', () => { });
}
const goodAlert = () => {
  Alert.alert(
    'Success',
    'Welcome to Compnet',
    [
      { text: 'OK' },
    ],
    { cancelable: false }
  );
};
const badAlert = () => {
  Alert.alert(
    'Failed',
    'User with that Number not found. Please Register First',
    [
      { text: 'OK' },
    ],
    { cancelable: false }
  );
};
class Login extends React.Component {
  constructor(props) {
    super(props)
    this._handleAdd = this._handleAdd.bind(this);
    this.state = {
      value: {
        faibano: null,
        contactno: null,
        name: null
      },
      loading: false
    }
  }
  static navigationOptions = {
    drawerLabel: () => null
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
    this.setState({ value: null });
  }
  _saveNo = async (phone) => {
    var faibano = phone.toString();
    const faibavalue = await AsyncStorage.getItem('faibano');
    if (faibavalue === null) {
      try {
        await AsyncStorage.setItem('faibano', faibano);
      } catch (error) {
        console.log("error")
      }
    }
    else {
      AsyncStorage.clear();
      try {
        await AsyncStorage.setItem('faibano', faibano);
        console.log("no error here")
      } catch (error) {
        console.log("error")
      }
    }
  }
  _onChange = (value) => {
    this.setState({
      value
    })
  }
  _handleAdd = () => {
    this.CheckConnectivity();
    try {
      const value = this._form.getValue();
      const { navigate } = this.props.navigation;
      // If the form is valid...
      if (value) {
        this.CheckConnectivity();
        this.setState({
          loading: true
        });
        const data = {
          FaibaNo: value.FaibaNo,
        }
        // Serialize and post the data
        const json = JSON.stringify(data)
        fetch('http://193.164.133.24:81/users/login.php', {
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
            if (response.message == "Logged In Successfully") {
              this.resetForm();
              this._saveNo(response.faibano);
              navigate("Home");
              goodAlert();
            }
            else if (response.message == "Incorrect Password") {
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
    let value;
    const { navigate } = this.props.navigation;
    AsyncStorage.getItem('faibano').then(() => {
      value = AsyncStorage.getItem('faibano');
      this.setState({ loading: false })
      return value;
    })
      .then((value) => {
        if (value != null) {
          console.log(value);
          navigate('Home')
        }
        else {
          console.log("not logged in");
        }
      });
    this.CheckConnectivity();
    handleAndroidBackButton(exitAlert);
  }
  render() {
    const { navigation } = this.props;
    return (
      <Block safe flex style={{ backgroundColor: theme.COLORS.WHITE }}>
        <NavBar
          title="Sign In"
          style={Platform.OS === 'android' ? { marginTop: theme.SIZES.BASE } : null}
        />
        <ImageBackground source={require('../../assets/back.jpg')} style={styles.backgroundImage}
        ><ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <KeyboardAvoidingView style={styles.container} behavior="height" enabled>
              <Loader
                loading={this.state.loading} />
              <Block flex center style={{ marginTop: theme.SIZES.BASE * 1.2, marginBottom: height * 0.1 }}>
                <Form
                  ref={c => this._form = c}
                  options={options}
                  type={User}
                  value={this.state.value}
                  onChange={this._onChange}
                />
              </Block>
              <Block flex middle>
                <Button
                  round
                  color="#FE2472"
                  onPress={() => this._handleAdd()}
                >
                  Sign in
              </Button>
                <Button color="transparent" shadowless onPress={() => navigation.navigate('Register')}>
                  <Text center color={theme.COLORS.ERROR} size={theme.SIZES.FONT * 0.75}>
                    {"Don't have an account? Sign Up"}
                  </Text>
                </Button>
              </Block>
            </KeyboardAvoidingView>
          </ScrollView>
        </ImageBackground>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: "center",
    alignItems: "center",
    opacity: 1
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: theme.SIZES.BASE * 0.3,
    paddingHorizontal: theme.SIZES.BASE,
  },
  scrollView: {
    flex: 1
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: 'center',
  },
});

export default Login;