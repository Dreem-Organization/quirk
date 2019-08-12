import React from "react";
import { ScrollView, View, StatusBar, Platform } from "react-native";
import theme from "./theme";
import { Constants, Linking } from "expo";
import {
  Header,
  Row,
  Container,
  IconButton,
  SubHeader,
  Paragraph,
  RoundedSelectorButton,
  B,
  ActionButton,
} from "./ui";
import {
  NavigationScreenProp,
  NavigationState,
  NavigationAction,
} from "react-navigation";
import { CBT_ON_BOARDING_SCREEN } from "./screens";
import { setSetting, getSettingOrSetDefault } from "./setting/settingstore";
import {
  HISTORY_BUTTON_LABEL_KEY,
  HISTORY_BUTTON_LABEL_DEFAULT,
  HistoryButtonLabelSetting,
  isHistoryButtonLabelSetting,
} from "./setting";
import i18n from "./i18n";
import { recordScreenCallOnFocus } from "./navigation";
import { isGrandfatheredIntoFreeSubscription } from "./history/grandfatherstore";

export { HistoryButtonLabelSetting };

// Exportable settings
export async function getHistoryButtonLabel(): Promise<
  HistoryButtonLabelSetting
> {
  const value = await getSettingOrSetDefault(
    HISTORY_BUTTON_LABEL_KEY,
    HISTORY_BUTTON_LABEL_DEFAULT
  );

  if (!isHistoryButtonLabelSetting(value)) {
    console.error(
      `Something went wrong getting ${HISTORY_BUTTON_LABEL_KEY}. Got: "${value}"`
    );
    return HISTORY_BUTTON_LABEL_DEFAULT;
  }

  return value;
}

const GrandfatheredInFreeQuirk = () => (
  <>
    <Paragraph
      style={{
        marginBottom: 4,
      }}
    >
      <B>You've been given Quirk for free! 🙌</B>
    </Paragraph>
    <Paragraph
      style={{
        marginBottom: 49,
      }}
    >
      This will go away if you uninstall the app. Feel free to reach out by
      email ({"ejc" + "@" + "quirk.fyi"}) if you get a new phone; we'll work
      something out. Thanks for being an early supporter! ❤️
    </Paragraph>
  </>
);

interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationAction>;
}

interface State {
  ready: boolean;
  historyButtonLabel?: HistoryButtonLabelSetting;
  isGrandfatheredIntoSubscription?: boolean;
}

class SettingScreen extends React.Component<Props, State> {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      isGrandfatheredIntoSubscription: true,
    };
    recordScreenCallOnFocus(this.props.navigation, "settings");
  }

  async componentDidMount() {
    await this.refresh();
  }

  refresh = async () => {
    const historyButtonLabel = await getHistoryButtonLabel();
    this.setState({
      historyButtonLabel,
    });

    this.setState({
      ready: true,
    });
  };

  navigateToList = () => {
    this.props.navigation.pop();
  };

  navigateToOnboardingScreen = () => {
    this.props.navigation.navigate(CBT_ON_BOARDING_SCREEN);
  };

  toggleHistoryButtonLabels = () => {
    if (!this.state.ready) {
      this.refresh();
      return;
    }

    if (this.state.historyButtonLabel === "alternative-thought") {
      setSetting<HistoryButtonLabelSetting>(
        HISTORY_BUTTON_LABEL_KEY,
        "automatic-thought"
      );
      this.refresh();
    } else {
      setSetting<HistoryButtonLabelSetting>(
        HISTORY_BUTTON_LABEL_KEY,
        "alternative-thought"
      );
      this.refresh();
    }
  };

  render() {
    const { historyButtonLabel, ready } = this.state;

    if (!ready) {
      return <View style={{ backgroundColor: theme.lightOffwhite }} />;
    }

    return (
      <View style={{ backgroundColor: theme.lightOffwhite }}>
        <ScrollView
          style={{
            backgroundColor: theme.lightOffwhite, marginTop: Constants.statusBarHeight,
            paddingTop: 24,
            height: "100%",
          }}
        >
          <Container
            style={{
              paddingBottom: 128,
            }}
          >
            <StatusBar barStyle="dark-content" />
            <Row style={{ marginBottom: 18 }}>
              <Header allowFontScaling={false} style={{fontSize: 28, flex: 1}}>{i18n.t("settings_screen")}</Header>
              <IconButton
                featherIconName={"list"}
                accessibilityLabel={i18n.t("accessibility.list_button")}
                onPress={() => this.navigateToList()}
              />
            </Row>

            <Row
              style={{
                marginBottom: 18,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <SubHeader>History button labels</SubHeader>
              <Paragraph
                style={{
                  marginBottom: 9,
                }}
              >
                By default, we set the buttons in the history screen to use the
                Alternative Thought. This helps cement the thought as "changed."
              </Paragraph>
              <RoundedSelectorButton
                title={"Alternative Thought"}
                selected={historyButtonLabel === "alternative-thought"}
                onPress={() => this.toggleHistoryButtonLabels()}
              />
              <RoundedSelectorButton
                title={"Automatic Thought"}
                selected={historyButtonLabel === "automatic-thought"}
                onPress={() => this.toggleHistoryButtonLabels()}
              />
            </Row>
            <View
              style={{
                marginTop: 18,
                borderRadius: 12,
                paddingBottom: 96,
              }}
            >
              <SubHeader
                style={{
                  alignSelf: "flex-start",
                  justifyContent: "center",
                }}
              >
                {i18n.t("got_feedback")}
              </SubHeader>
              <Row
                style={{
                  alignSelf: "flex-start",
                  justifyContent: "center",
                }}
              >
                <ActionButton
                  fillColor={theme.lightGray}
                  textColor={theme.pink}
                  title={i18n.t('email_us')}
                  width={"100%"}
                  onPress={() => {
                    Linking.openURL("mailto:support@dreem.com");
                  }}
                />
              </Row>
            </View>
          </Container>
        </ScrollView>
      </View>
    );
  }
}

export default SettingScreen;
