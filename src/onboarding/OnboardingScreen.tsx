import React from "react";
import {
  NavigationScreenProp,
  NavigationState,
  NavigationAction,
} from "react-navigation";
import { recordScreenCallOnFocus } from "../navigation";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { sliderWidth, itemWidth } from "../form/sizes";
import { View, Image } from "react-native";
import { Header, Container, Paragraph, ActionButton } from "../ui";
import { Constants, Haptic } from "expo";
import i18n from "../i18n";
import theme from "../theme";
import haptic from "../haptic";
import * as stats from "../stats";
import { CBT_FORM_SCREEN } from "../screens";

interface ScreenProps {
  navigation: NavigationScreenProp<NavigationState, NavigationAction>;
}


const DreemStep = () => (
  <View
    style={{
      height: "100%",
      justifyContent: "center",
      flex: 1,
    }}
  >
    <Image
      source={require("../../assets/onboarding/0.png")}
      style={{
        width: 250,
        height: 250,
        resizeMode: "contain",
        alignSelf: "center",
        marginBottom: 20,
      }}
    />
    <Header
      style={{
        fontSize: 28,
      }}
    >
      {i18n.t("onboarding_title_0")}
    </Header>
    <Paragraph
      style={{
        fontSize: 20,
      }}
    >
      {i18n.t("onboarding_body_0")}
    </Paragraph>
  </View>
);

const RecordStep = () => (
  <View
    style={{
      height: "100%",
      justifyContent: "center",
      flex: 1,
    }}
  >
    <Image
      source={require("../../assets/onboarding/1.png")}
      style={{
        width: 250,
        height: 250,
        resizeMode: "contain",
        alignSelf: "center",
        marginBottom: 20,
      }}
    />
    <Header
      style={{
        fontSize: 28,
      }}
    >
      {i18n.t("onboarding_title_1")}
    </Header>
    <Paragraph
      style={{
        fontSize: 20,
      }}
    >
      {i18n.t("onboarding_body_1")}
    </Paragraph>
  </View>
);

const ChallengeStep = () => (
  <View
    style={{
      height: "100%",
      justifyContent: "center",
      flex: 1,
    }}
  >
    <Image
      source={require("../../assets/onboarding/2.png")}
      style={{
        width: 250,
        height: 250,
        resizeMode: "contain",
        alignSelf: "center",
        marginBottom: 48,
      }}
    />
    <Header
      style={{
        fontSize: 28,
      }}
    >
      {i18n.t("onboarding_title_2")}
    </Header>
    <Paragraph
      style={{
        fontSize: 20,
      }}
    >
      {i18n.t("onboarding_body_2")}
    </Paragraph>
  </View>
);

const ChangeStep = () => (
  <View
    style={{
      height: "100%",
      justifyContent: "center",
      flex: 1,
    }}
  >
    <Image
      source={require("../../assets/onboarding/3.png")}
      style={{
        width: 250,
        height: 250,
        resizeMode: "contain",
        alignSelf: "center",
        marginBottom: 48,
      }}
    />
    <Header
      style={{
        fontSize: 28,
      }}
    >
      {i18n.t("onboarding_title_3")}
    </Header>
    <Paragraph
      style={{
        fontSize: 20,
      }}
    >
      {i18n.t("onboarding_body_3")}
    </Paragraph>
  </View>
);

const DockStep = ({ onContinue }) => (
  <View
    style={{
      height: "100%",
      justifyContent: "center",
      flex: 1,
    }}
  >
    <Image
      source={require("../../assets/onboarding/4.png")}
      style={{
        width: 250,
        height: 250,
        resizeMode: "contain",
        alignSelf: "center",
        marginBottom: 48,
      }}
    />
    <Header
      style={{
        fontSize: 28,
      }}
    >
      {i18n.t("onboarding_title_4")}
    </Header>

    <Paragraph
      style={{
        fontSize: 20,
        marginBottom: 18,
      }}
    >
      {i18n.t("onboarding_body_4")}
    </Paragraph>
    <ActionButton title={i18n.t("continue")} width="100%" onPress={onContinue} />
  </View>
);

export default class extends React.Component<ScreenProps> {
  static navigationOptions = {
    header: null,
  };

  state = {
    activeSlide: 0,
  };

  constructor(props) {
    super(props);
    recordScreenCallOnFocus(this.props.navigation, "intro");
  }

  stopOnBoarding = () => {
    haptic.notification(Haptic.NotificationFeedbackType.Success);
    stats.endedOnboarding(); // here
    // console.log('fick');
    // debugger
    this.props.navigation.replace(CBT_FORM_SCREEN, {
      fromOnboarding: true,
    });
  };

  _carousel = null;

  _renderItem = ({ item, index }) => {
    if (item.slug === "dreem") {
      return <DreemStep />;
    }

    if (item.slug === "record") {
      return <RecordStep />;
    }

    if (item.slug === "challenge") {
      return <ChallengeStep />;
    }

    if (item.slug === "change") {
      return <ChangeStep />;
    }

    if (item.slug === "in-dock") {
      return <DockStep onContinue={this.stopOnBoarding} />;
    }

    return null;
  };

  render() {
    return (
      <Container
        style={{
          height: "100%",
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: Constants.statusBarHeight + 12,
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          paddingBottom: 0,
        }}
      >
        <Carousel
          ref={c => {
            this._carousel = c;
          }}
          data={[
            { slug: "dreem" },
            { slug: "record" },
            { slug: "challenge" },
            { slug: "change" },
            { slug: "in-dock" },
          ]}
          renderItem={this._renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          onSnapToItem={index => this.setState({ activeSlide: index })}
        />

        <Pagination
          dotsLength={5}
          activeDotIndex={this.state.activeSlide}
          containerStyle={{
            margin: 0,
            padding: 0,
            backgroundColor: "transparent",
          }}
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: theme.pink,
          }}
          inactiveDotStyle={{
            backgroundColor: theme.gray,
          }}
        />
      </Container>
    );
  }
}
