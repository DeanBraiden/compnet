import React from 'react';
import {
    Dimensions,
    StyleSheet,
    Platform,
    Image,
    TouchableOpacity, Share, ImageBackground,
} from 'react-native';

// galio components
import {
    Text, Button, Block, NavBar, Icon
} from 'galio-framework';
import theme from '../theme';

const url = 'https://awesome.contents.com/';
const title = 'Share with your friends';
const message = 'Please check this out.';
const icon = 'data:<data_type>/<file_extension>;base64,<base64_data>';
const options = Platform.select({
    ios: {
        activityItemSources: [
            { // For sharing url with custom title.
                placeholderItem: { type: 'url', content: url },
                item: {
                    default: { type: 'url', content: url },
                },
                subject: {
                    default: title,
                },
                linkMetadata: { originalUrl: url, url, title },
            },
            { // For sharing text.
                placeholderItem: { type: 'text', content: message },
                item: {
                    default: { type: 'text', content: message },
                    message: null, // Specify no text to share via Messages app.
                },
                linkMetadata: { // For showing app icon on share preview.
                    title: message
                },
            },
            { // For using custom icon instead of default text icon at share preview when sharing with message.
                placeholderItem: {
                    type: 'url',
                    content: icon
                },
                item: {
                    default: {
                        type: 'text',
                        content: `${message} ${url}`
                    },
                },
                linkMetadata: {
                    title: message,
                    icon: icon
                }
            },
        ],
    },
    default: {
        title,
        subject: title,
        message: `${message} ${url}`,
    },
});
const { height } = Dimensions.get('window');
const orderConfirmedImage = require('../../assets/cas.png');
const onShare = async () => {
    try {
        const result = await Share.share({
            message:
                "https://play.google.com/store/apps/details?id=com.compnetfaiba.compnetapp&hl=en",
        });
        if (result.action === Share.sharedAction) {
            if (result.activityType) {
                // shared with activity type of result.activityType
            } else {
                // shared
            }
        } else if (result.action === Share.dismissedAction) {
            // dismissed
        }
    } catch (error) {
        alert(error.message);
    }
};
class InviteFriends extends React.Component {
    render() {
        const { navigation } = this.props;
        return (
            <Block safe flex >
                <NavBar
                    title="Share Our App"
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
                    <Block flex center space="around" style={styles.container}>
                        <Block center flex={2}>
                            <Block center style={{ marginBottom: theme.SIZES.BASE * 2 }}>
                                <Image
                                    source={orderConfirmedImage}
                                    style={{ marginBottom: theme.SIZES.BASE * 2 }}
                                />
                                <Text h4 color={theme.COLORS.BLACK}>
                                    Glad you're liking our App!
              </Text>
                            </Block>
                            <Text
                                color={theme.COLORS.BLACK}
                                style={{ marginBottom: theme.SIZES.BASE }}
                            >
                            </Text>
                            <Text color={theme.COLORS.INFO}>
                                Share it with your friends
            </Text>
                        </Block>
                        <Button size="large" color="info" round onPress={onShare}>
                            Share App
          </Button>
                    </Block>
                </ImageBackground>
            </Block>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: theme.SIZES.BASE * 0.3,
        paddingHorizontal: theme.SIZES.BASE,
        marginTop: theme.SIZES.BASE * 1.875,
        marginBottom: height * 0.1
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: "center",
        alignItems: "center",
        opacity: 1
    },
    block: {
        paddingTop: theme.SIZES.BASE * 0.3,
        paddingHorizontal: theme.SIZES.BASE,
        marginTop: theme.SIZES.BASE * 1.875,
    }
});

export default InviteFriends;