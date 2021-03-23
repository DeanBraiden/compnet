import React from 'react';
import {
  Alert,
  Dimensions,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  AsyncStorage,
  BackHandler,
  ImageBackground,
  NetInfo,
  ScrollView,
} from 'react-native';
// galio component
import { Block, Button, Text, NavBar } from 'galio-framework';
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
  flexDirection: 'row',
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
  150: 'fisihour',
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
  Name: t.String,
  FaibaNo: FaibaNo,
  ContactNo: ContactNo,
  ReferralCode: t.String
});
var options = {
  auto: 'placeholders',
  fields: {
    FaibaNo: {
      label: 'Faiba Number', // <= label for the name field
      help: 'Start with 254',
      placeholder: '254',
    },
    ContactNo: {
      label: 'Contact Number', // <= label for the name field
      help: 'Start with 254',
      placeholder: '254',
    },
    Name: {
      label: 'Your Name', // <= label for the name field
      help: '',
    },
    ReferralCode: {
      label: 'Referral Code', // <= label for the name field
      help: 'Use COMP71 if you do not have referrer',
    }
  },
  stylesheet: stylesheet,
};

const thumbMeasure = (width - 48 - 32) / 3;
const exitAlert = () => {
  Alert.alert(
    'Exit App',
    'Exiting the application?',
    [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'OK', onPress: () => BackHandler.exitApp() },
    ],
    { cancelable: false }
  );
};
const goodAlert = () => {
  Alert.alert('Success', 'Welcome to Compnet', [{ text: 'OK' }], {
    cancelable: false,
  });
};
const badAlert = () => {
  Alert.alert(
    'Failed',
    'Faiba Number already exists. Kindly Log in',
    [{ text: 'OK' }],
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
};

class Login extends React.Component {
  constructor(props) {
    super(props);
    this._handleAdd = this._handleAdd.bind(this);
    this.state = {
      value: {
        FaibaNo: null,
        ContactNo: null,
        Name: null,
        ReferralCode: 'COMP71',
      },
      loading: false
    };
  }
  static navigationOptions = {
    drawerLabel: () => null
  }
  CheckConnectivity = () => {
    // For Android devices
    if (Platform.OS === "android") {
      try {
        NetInfo.isConnected.fetch().then(isConnected => {
          if (isConnected) {
          } else {
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
  _saveNo = async phone => {
    var faibano = phone.toString();
    const faibavalue = await AsyncStorage.getItem('faibano');
    if (faibavalue === null) {
      try {
        await AsyncStorage.setItem('faibano', faibano);
      } catch (error) {
        console.log('error');
      }
    } else {
      AsyncStorage.clear();
      try {
        await AsyncStorage.setItem('faibano', faibano);
      } catch (error) {
        console.log('error');
      }
    }
  }

  _onChange = value => {
    this.setState({
      value,
    });
  };

  _handleAdd = () => {
    this.CheckConnectivity();
    const value = this._form.getValue();
    const { navigate } = this.props.navigation;
    // If the form is valid...
    if (value) {
      const data = {
        FaibaNo: value.FaibaNo,
        ContactNo: value.ContactNo,
        Name: value.Name,
        ReferralCode: value.ReferralCode,
      };
      this.CheckConnectivity();
      this.setState({
        loading: true,
      });
      // Serialize and post the data
      const json = JSON.stringify(data);
      fetch('http://193.164.133.24:81/users/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: json,
      })
        .then(response => response.json())
        .then(response => {
          this.setState({
            loading: false,
          });
          if (response.message == 'User was created.') {
            this._saveNo(value.FaibaNo);
            this.resetForm();
            navigate('Home');
            goodAlert();
          } else if (response.message == 'Unable to create user.') {
            this.resetForm();
            badAlert();
          }
        });
    } else {
      // Form validation error
      alert('Please fix the errors highlited and try again.');
    }
  };
  componentWillUnmount() {
    this.setState = {
      value: {
        faibano: null,
        contactno: null,
        name: null,
        referralcode: null
      },
      spinner: false,
    };
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
        if (value) {
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
          title="Sign Up"
          style={
            Platform.OS === 'android' ? { marginTop: theme.SIZES.BASE } : null
          }
        />
        <ImageBackground source={require('../../assets/back.jpg')} style={styles.backgroundImage}
        >
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <Loader
              loading={this.state.loading} />
            <KeyboardAvoidingView
              style={styles.container}
              behavior="height"
              enabled
            >
              <Block
                flex
                center
                style={{
                  marginTop: theme.SIZES.BASE * 1,
                }}
              >
                <Form
                  style={{ marginBottom: theme.SIZES.BASE * 3 }}
                  ref={c => (this._form = c)}
                  options={options}
                  type={User}
                  value={this.state.value}
                  onChange={this._onChange}
                />
              </Block>
            </KeyboardAvoidingView>
            <Block flex middle>
              <Block
                flex={2}
                center
                space="between"
                style={{ marginTop: theme.SIZES.BASE * 5 }}
              >
                <Block flex middle>
                  <Button round color="error" onPress={this._handleAdd}>
                    Sign up
                  </Button>
                  <Button
                    color="transparent"
                    shadowless
                    onPress={() => navigation.navigate('Login')}
                  >
                    <Text
                      center
                      color={theme.COLORS.ERROR}
                      size={theme.SIZES.FONT * 0.75}
                    >
                      Already have an account? Sign In
                    </Text>
                  </Button>
                </Block>
              </Block>
            </Block>

          </ScrollView>
        </ImageBackground>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: theme.SIZES.BASE * 0.3,
    paddingHorizontal: theme.SIZES.BASE,
  },
  scrollView: {
    flex: 1,
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: "center",
    alignItems: "center",
    opacity: 1
  },
});

export default Login;
