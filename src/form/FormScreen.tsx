import { ActionButton, Container, Row, Header, IconButton } from "../ui";
import React from "react";
import { View, StatusBar } from "react-native";
import { NavigationScreenProp, NavigationAction } from "react-navigation";
import theme from "../theme";
import { Constants, Haptic } from "expo";
import i18n from "../i18n";
import {
  CBT_LIST_SCREEN,
  EXPLANATION_SCREEN,
  CBT_ON_BOARDING_SCREEN,
  CBT_VIEW_SCREEN,
} from "../screens";
import * as flagstore from "../flagstore";
import FormView, { Slides } from "./FormView";
import { SavedThought, Thought, newThought } from "../thoughts";
import { get } from "lodash";
import { exists, getIsExistingUser, setIsExistingUser } from "../thoughtstore";
import haptic from "../haptic";
import { recordScreenCallOnFocus } from "../navigation";
import * as stats from "../stats";

interface ScreenProps {
  navigation: NavigationScreenProp<any, NavigationAction>;
}

interface FormScreenState {
  thought?: SavedThought | Thought;
  slideToShow: Slides;
  shouldShowHelpBadge: boolean;
  shouldShowOnboarding: boolean;
  shouldShowInFlowOnboarding: boolean;
  isReady: boolean;
}

export type Slides = "automatic" | "distortions" | "challenge" | "alternative";

export default class extends React.Component<ScreenProps, FormScreenState> {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.props.navigation.addListener("willFocus", async payload => {
      // We've come from a list item or the viewer
      const thought = get(payload, "state.params.thought", false);
      if (thought && thought.uuid) {
        // Check if we're editing a particular slide
        const slide = get(payload, "action.params.slide", undefined);
        if (slide) {
          this.setState({
            slideToShow: slide,
          });
        }

        this.setState({ thought, isReady: true });
        return;
      }

      // We've come from the form view and we've been asked to clear the screen
      const shouldClear = get(payload, "action.params.clear", false);
      if (shouldClear) {
        this.setState({
          thought: newThought(),
          slideToShow: "automatic",
          isReady: true, // Shows the screen again
        });
        return;
      }
    });

    recordScreenCallOnFocus(this.props.navigation, "form");

    getIsExistingUser().then(isExisting => {
      // New Users
      if (!isExisting) {
        stats.newuser();
      }
    });
  }

  async componentDidMount() {
    const isExisting = await getIsExistingUser();
    if (!isExisting) {
      setIsExistingUser();
      this.setState({
        shouldShowOnboarding: true,
      });
    }

    // Check if coming from onboarding
    // @ts-ignore argle bargle typescript plz don't do these things
    if (this.props.navigation.getParam("fromOnboarding", false)) {
      this.setState({
        shouldShowInFlowOnboarding: true,
      });
    }

    flagstore.get("start-help-badge", "true").then(val => {
      this.setState({ shouldShowHelpBadge: val });
    });

    this.setState({
      isReady: true,
    });
  }

  state = {
    isEditing: true,
    thought: newThought(),
    slideToShow: "automatic" as Slides,
    shouldShowHelpBadge: false,
    shouldShowOnboarding: false,
    shouldShowInFlowOnboarding: false,
    isReady: false,
  };

  onChangeAutomaticThought = val => {
    this.setState(prevState => {
      prevState.thought.automaticThought = val;
      return prevState;
    });
  };

  onChangeChallenge = (val: string) => {
    this.setState(prevState => {
      prevState.thought.challenge = val;
      return prevState;
    });
  };

  onChangeAlternativeThought = (val: string) => {
    this.setState(prevState => {
      prevState.thought.alternativeThought = val;
      return prevState;
    });
  };

  onChangeDistortion = (selected: string) => {
    haptic.selection(); // iOS users get a selected buzz

    this.setState(prevState => {
      const { cognitiveDistortions } = prevState.thought;
      const index = cognitiveDistortions.findIndex(
        ({ slug }) => slug === selected
      );

      cognitiveDistortions[index].selected = !cognitiveDistortions[index]
        .selected;

      prevState.thought.cognitiveDistortions = cognitiveDistortions;
      return prevState;
    });
  };

  onSave = thought => {
    this.props.navigation.push(CBT_VIEW_SCREEN, {
      thought,
    });
    this.setState({
      slideToShow: "automatic",
      isReady: false, // "refreshes" the screen
    });
  };

  onNew = () => {
    haptic.impact(Haptic.ImpactFeedbackStyle.Light);
    this.setState({
      thought: newThought(),
    });
  };

  onEdit = (uuid: string, slide: Slides) => {
    this.setState({
      // Start on the closest to where they were
      slideToShow: slide,
    });
  };

  slideToIndex = (slide: Slides): number => {
    switch (slide) {
      case "automatic":
        return 0;
      case "distortions":
        return 1;
      case "challenge":
        return 2;
      case "alternative":
        return 3;
    }
  };

  render() {
    const {
      shouldShowHelpBadge,
      shouldShowOnboarding,
      shouldShowInFlowOnboarding,
      isReady,
    } = this.state;

    if (!isReady) {
      return null;
    }

    if (shouldShowOnboarding) {
      this.props.navigation.replace(CBT_ON_BOARDING_SCREEN);
    }

    return (
      <View
        style={{
          backgroundColor: theme.lightOffwhite,
          height: "100%",
        }}
      >
        <StatusBar barStyle="dark-content" />
        <Container
          style={{
            height: "100%",
            paddingLeft: 0,
            paddingRight: 0,
            marginTop: Constants.statusBarHeight,
            paddingTop: 12,
          }}
        >
          <Row
            style={{
              marginBottom: 24,
              paddingLeft: 24,
              paddingRight: 24,
            }}
          >

            <Header allowFontScaling={false} style={{fontSize: 30}}>Journal</Header>
            <IconButton
              accessibilityLabel={i18n.t("accessibility.list_button")}
              featherIconName={"list"}
              onPress={() => this.props.navigation.push(CBT_LIST_SCREEN)}
            />
          </Row>
          <FormView
            onSave={this.onSave}
            thought={this.state.thought}
            slideToShow={this.state.slideToShow}
            shouldShowInFlowOnboarding={shouldShowInFlowOnboarding}
            onChangeAlternativeThought={this.onChangeAlternativeThought}
            onChangeAutomaticThought={this.onChangeAutomaticThought}
            onChangeChallenge={this.onChangeChallenge}
            onChangeDistortion={this.onChangeDistortion}
            navigation={this.props.navigation}
            slideToIndex={this.slideToIndex}
          />
        </Container>
      </View>
    );
  }
}
