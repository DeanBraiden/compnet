import React from 'react';
import PropTypes from 'prop-types';
import {
  Image, StyleSheet, ScrollView, SafeAreaView, Platform,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerItems,
} from 'react-navigation';

// screens
import Support from './src/screens/Cards';
import CompnetDefault from './src/screens/CompnetDefault';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import BuyAirtime from './src/screens/BuyAirtime';
import BuyBundles from './src/screens/BuyBundles';
import ConvertAirtime from './src/screens/ConvertAirtime';
import CheckBalance from './src/screens/CheckBalance';
import OfflinePayments from './src/screens/OfflinePayments';
import InviteFriends from './src/screens/InviteFriends';
import LogOut from './src/screens/LogOut';
import theme from './src/theme';
import { Block, Icon, Text } from 'galio-framework';
import StateUtils from 'react-navigation/src/StateUtils';
let value = "";
let screens = "";

const GalioDrawer = props => (
  <SafeAreaView style={styles.drawer} forceInset={{ top: 'always', horizontal: 'never' }}>
    <Block space="between" row style={styles.header}>
      <Block flex style={styles.middle}>
        <Block flex={1.0}><Image source={require('./assets/cas.png')} style={styles.avatar} /></Block>
        <Text muted size={theme.SIZES.FONT * 0.875}>{value}</Text>
      </Block>
    </Block>
    <ScrollView>
      <DrawerItems {...props} />
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.SIZES.BASE,
    paddingTop: theme.SIZES.BASE * 0.1,
    paddingBottom: theme.SIZES.BASE * 1.6875,
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: 0.5,
    marginTop: Platform.OS === 'android' ? theme.SIZES.BASE * 2 : null,
  },
  avatar: {
    width: theme.SIZES.BASE * 3,
    height: theme.SIZES.BASE * 3,
    borderRadius: theme.SIZES.BASE * 1.25,
  },
  middle: {
    justifyContent: 'center',
  },
});

const MenuIcon = ({ name, family, focused }) => (
  <Icon
    name={name}
    family={family}
    size={theme.SIZES.FONT}
    color={focused ? theme.COLORS.WHITE : '#5D5D5D'}
  />
);

MenuIcon.defaultProps = {
  name: null,
  family: null,
  focused: false,
};

MenuIcon.propTypes = {
  name: PropTypes.string,
  family: PropTypes.string,
  focused: PropTypes.bool,
};
screens = {
  Login: {
    screen: Login
  },
  Home: {
    screen: CompnetDefault,
    navigationOptions: {
      drawerLabel: 'Home',
      drawerIcon: props => <MenuIcon name="home" family="font-awesome" focused={props.focused} />,
    },
  },
  BuyAirtime: {
    screen: BuyAirtime,
    navigationOptions: {
      drawerLabel: 'Buy Airtime',
      drawerIcon: props => <MenuIcon name="phone" family="font-awesome" focused={props.focused} />,
    },
  },
  BuyBundles: {
    screen: BuyBundles,
    navigationOptions: {
      drawerLabel: 'Buy Bundles',
      drawerIcon: props => <MenuIcon name="wifi" family="font-awesome" focused={props.focused} />,
    },
  },
  ConvertAirtime: {
    screen: ConvertAirtime,
    navigationOptions: {
      drawerLabel: 'Convert Airtime to Bundles',
      drawerIcon: props => <MenuIcon name="refresh" family="font-awesome" focused={props.focused} />,
    },
  },
  CheckBalance: {
    screen: CheckBalance,
    navigationOptions: {
      drawerLabel: 'Check Balance',
      drawerIcon: props => <MenuIcon name="bar-chart" family="font-awesome" focused={props.focused} />,
    },
  },
  Support: {
    screen: Support,
    navigationOptions: {
      drawerLabel: 'Support',
      drawerIcon: props => <MenuIcon name="info" family="font-awesome" focused={props.focused} />,
    },
  },
  OfflinePayments: {
    screen: OfflinePayments,
    navigationOptions: {
      drawerLabel: 'Offline Payments',
      drawerIcon: props => <MenuIcon name="info" family="font-awesome" focused={props.focused} />,
    },
  },
  InviteFriends: {
    screen: InviteFriends,
    navigationOptions: {
      drawerLabel: 'Share App',
      drawerIcon: props => <MenuIcon name="share-alt" family="font-awesome" focused={props.focused} />,
    },
  },
  Register: {
    screen: Register,
  },
  LogOut: {
    screen: LogOut,
    navigationOptions: {
      drawerLabel: 'Log Out',
      drawerIcon: props => <MenuIcon name="sign-out" family="font-awesome" focused={props.focused} />,
    },
  },
};
const options = {
  contentComponent: props => <GalioDrawer {...props} />,
  contentOptions: {
    labelStyle: {
      fontWeight: '500',
      color: theme.COLORS.GREY,
      fontSize: theme.SIZES.FONT * 0.875,
      marginLeft: theme.SIZES.BASE * 0.75,
    },
    login: {
      color: theme.COLORS.WHITE,
      backgroundColor: theme.COLORS.WHITE,
    },
    activeLabelStyle: {
      color: theme.COLORS.WHITE,
    },
    activeBackgroundColor: theme.COLORS.THEME,
    itemsContainerStyle: {
      paddingVertical: 0,
    },
    iconContainerStyle: {
      marginHorizontal: 0,
      marginLeft: theme.SIZES.BASE * 1.65,
      // marginRight: theme.SIZES.BASE * 0.76,
    },
  },
};

const GalioApp = createDrawerNavigator(screens, options);

export default GalioApp;
