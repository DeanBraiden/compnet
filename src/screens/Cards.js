import React from 'react';
import {
  ScrollView, StyleSheet, Dimensions, Platform, TouchableOpacity, View, Text, ImageBackground, Linking
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Galio components
import {
  Block, NavBar, Icon
} from 'galio-framework';
import theme from '../theme';

const { width } = Dimensions.get('screen');

import { Card } from "@paraboly/react-native-card";

export default class Support extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      faiba: {
        faibano: 0,
        balance: 0
      },
      balance: []
    }
  }
  render() {
    const { navigation } = this.props;
    return (
      <Block safe flex style={{ backgroundColor: theme.COLORS.WHITE }}>
        <NavBar
          title="Call Support"
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
          <ScrollView>
            <Block style={{ marginBottom: theme.SIZES.BASE }}>
              <Block flex style={{ marginBottom: theme.SIZES.BASE }}>
                <Card
                  title="Waweru"
                  iconName="phone"
                  defaultTitle=""
                  iconType="Font Awesome"
                  iconColor="#fff"
                  titleColor="#000"
                  bottomRightColor="#fff"
                  iconBackgroundColor="#FE2472"
                  defaultContent=""
                  onPress={() => Linking.openURL(`tel:${'254729501646'}`)}
                />
              </Block>
              <Block flex style={{ marginBottom: theme.SIZES.BASE }}>
                <Card
                  title="Jacinta"
                  iconName="phone"
                  defaultTitle=""
                  iconType="Font Awesome"
                  defaultContent=""
                  iconColor="#fff"
                  titleColor="#000"
                  bottomRightColor="#fff"
                  iconBackgroundColor="#FE2472"
                  onPress={() => Linking.openURL(`tel:${'254714714856'}`)}
                />
              </Block>
              <Block flex style={{ marginBottom: theme.SIZES.BASE }}>
                <Card
                  title="Agnes"
                  iconName="phone"
                  defaultTitle=""
                  iconType="Font Awesome"
                  iconColor="#fff"
                  titleColor="#000"
                  bottomRightColor="#fff"
                  iconBackgroundColor="#FE2472"
                  defaultContent=""
                  onPress={() => Linking.openURL(`tel:${'254711651335'}`)}
                />
              </Block>
              <Block flex style={{ marginBottom: theme.SIZES.BASE }}>
                <Card
                  title="Steve"
                  iconName="phone"
                  defaultTitle=""
                  iconType="Font Awesome"
                  iconColor="#fff"
                  titleColor="#000"
                  bottomRightColor="#fff"
                  iconBackgroundColor="#FE2472"
                  defaultContent=""
                  onPress={() => Linking.openURL(`tel:${'254747356631'}`)}
                />
              </Block>
              <Block flex style={{ marginBottom: theme.SIZES.BASE }}>
                <Card
                  title="Shiri"
                  iconName="phone"
                  defaultTitle=""
                  iconType="Font Awesome"
                  iconColor="#fff"
                  titleColor="#000"
                  bottomRightColor="#fff"
                  iconBackgroundColor="#FE2472"
                  defaultContent=""
                  onPress={() => Linking.openURL(`tel:${'254725927963'}`)}
                />
              </Block>
              <Block flex style={{ marginBottom: theme.SIZES.BASE }}>
                <Card
                  title="Stans"
                  iconName="phone"
                  defaultTitle=""
                  iconType="Font Awesome"
                  iconColor="#fff"
                  titleColor="#000"
                  bottomRightColor="#fff"
                  iconBackgroundColor="#FE2472"
                  defaultContent=""
                  onPress={() => Linking.openURL(`tel:${'254722648222'}`)}
                />
              </Block>
              <Block flex style={{ marginBottom: theme.SIZES.BASE }}>
                <Card
                  title="Vincent"
                  iconName="phone"
                  defaultTitle=""
                  iconType="Font Awesome"
                  iconColor="#fff"
                  titleColor="#000"
                  bottomRightColor="#ff300"
                  iconBackgroundColor="#FE2472"
                  defaultContent=""
                  onPress={() => Linking.openURL(`tel:${'254705542400'}`)}
                />
              </Block>
            </Block>
          </ScrollView>
        </ImageBackground>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  cards: {
    width,
    backgroundColor: theme.COLORS.WHITE,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  text_1: {
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 24.7,
    letterSpacing: 0,
    color: "#000",
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: "center",
    alignItems: "center",
    opacity: 1
  },
  card: {
    backgroundColor: theme.COLORS.WHITE,
    width: width - theme.SIZES.BASE * 2,
    marginVertical: theme.SIZES.BASE * 0.875,
    elevation: theme.SIZES.BASE / 2,
  },
  full: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },
  noRadius: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  rounded: {
    borderRadius: theme.SIZES.BASE * 0.1875,
  },
  gradient: {
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
