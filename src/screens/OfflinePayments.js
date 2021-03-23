import React from 'react';
import PropTypes from 'prop-types';
import {
    Image, StyleSheet, ScrollView, Platform, TouchableOpacity, KeyboardAvoidingView, Linking
} from 'react-native';

import Constants from 'expo-constants';

// Galio components
import {
    Button, Block, Card, Text, Icon, NavBar,
} from 'galio-framework';
import theme from '../theme';

const Author = props => (
    <Block row shadow middle space="between" style={styles.author}>
        <Block flex={0.25}>
            <Image source={{ uri: props.avatar }} style={styles.avatar} />
        </Block>
        <Block flex={0.7} style={styles.middle}>
            <Text style={{ fontWeight: '500' }}>{props.title}</Text>
            <Text p muted>{props.caption}</Text>
        </Block>
        <Block flex={0.5} row middle space="around">
            <Block row middle>
                <Icon name="eye" family="material-community" color={theme.COLORS.MUTED} size={theme.SIZES.FONT * 0.8} />
                <Text size={theme.SIZES.FONT * 0.7} p muted style={{ marginLeft: theme.SIZES.FONT * 0.25 }}>25.6k</Text>
            </Block>
            <Block row middle>
                <Icon name="heart-outline" family="material-community" color={theme.COLORS.MUTED} size={theme.SIZES.FONT * 0.8} />
                <Text size={theme.SIZES.FONT * 0.7} p muted style={{ marginLeft: theme.SIZES.FONT * 0.25 }}>936</Text>
            </Block>
        </Block>
    </Block>
);

Author.defaultProps = {
    author: null,
    title: null,
    caption: null,
};

Author.propsTypes = {
    author: PropTypes.string,
    title: PropTypes.string,
    caption: PropTypes.string,
};


const OfflinePayments = props => (
    <Block safe flex>
        <NavBar
            title="Offline Payments"
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
        <Block style={styles.backgroundImage}
        >
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <KeyboardAvoidingView>
                    <Block flex style={styles.news}>
                        <Image
                            source={{ uri: 'https://innov8tiv.com/wp-content/uploads/2017/12/faiba4g-1280x720.jpg' }}
                            style={styles.articleImage}
                        />
                        <Block style={styles.article}>
                            <Text h4>
                                Did you know you could still make offline payments?
          </Text>
                            <Text muted style={[styles.text, { marginVertical: theme.SIZES.BASE * 1.3 }]}>
                                Method 1 : Paybill
          </Text>
                            <Text style={styles.text}>
                                Send the exact amount to Paybill No : 878366
                                Account: Your Faiba Number ie 254747******
          </Text>
                            <Text style={styles.text}>
                                For Airtime, add a "t" to the start of your number
                                Account: Your Faiba Number ie t254747******
          </Text>
                            <Text style={styles.text}>
                                For Balance, add a "b" to the start of your number
                                Account: Your Faiba Number ie b254747******. The charge is 2/-
          </Text>
                            <Text muted style={[styles.text, { marginVertical: theme.SIZES.BASE * 1.3 }]}>
                                Method 2 : USSD(*483*1979#)
          </Text>
                            <Text style={styles.text}>
                                Click on the button below and follow the prompts
          </Text>
                            <Button
                                round
                                color="#FE2472"
                                onPress={() => Linking.openURL(`tel:${'*483*1979#'}`)}
                            >
                                Call *483*1979#
              </Button>
                        </Block>
                    </Block>
                </KeyboardAvoidingView>
            </ScrollView>
        </Block>
    </Block>
);

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
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: "center",
        alignItems: "center",
        opacity: 1
    },
    text: {
        fontWeight: '400',
        fontSize: theme.SIZES.FONT * 0.875,
        lineHeight: theme.SIZES.BASE * 1.25,
        letterSpacing: 0.3,
        marginBottom: theme.SIZES.BASE,
    },
});

export default OfflinePayments;