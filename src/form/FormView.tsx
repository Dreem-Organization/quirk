import { Header, Container, Row, ActionButton } from "../ui";
import React from "react";
import theme from "../theme";
import Carousel, { Pagination }  from "react-native-snap-carousel";
import { View, Keyboard, Platform, KeyboardAvoidingView } from "react-native";
import * as Haptic from 'expo-haptics';
import haptic from "../haptic";
import { sliderWidth, itemWidth } from "./sizes";
import { Thought } from "../thoughts";
import universalHaptic from "../haptic";
import AutomaticThought from "./AutomaticThought";
import AlternativeThought from "./AlternativeThought";
import Challenge from "./Challenge";
import Distortions from "./Distortions";
import i18n from "../i18n";
import { saveExercise } from "../thoughtstore";
import * as stats from "../stats";

export type Slides = "automatic" | "distortions" | "challenge" | "alternative";

const slideToIndex = (slide: Slides): number => {
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

interface FormViewProps {
  onSave: (thought: Thought) => void;
  thought: Thought;
  slideToShow: Slides;
  shouldShowInFlowOnboarding: boolean;
  onChangeAutomaticThought: (val: string) => void;
  onChangeChallenge: (val: string) => void;
  onChangeAlternativeThought: (val: string) => void;
  onChangeDistortion: (selected: string) => void;
  navigation:any;
}

interface FormViewState {
  activeSlide: number;
}

export default class extends React.Component<FormViewProps, FormViewState> {
  static navigationOptions = {
    header: null,
  };

  state = {
    activeSlide: 0,
  };

  _carousel = null;

  onSave = () => {
    universalHaptic.notification(Haptic.NotificationFeedbackType.Success);

    saveExercise(this.props.thought).then(thought => {
      stats.thoughtRecorded();
      this.props.onSave(thought);
    });
  };

  _renderItem = ({ item, index }) => {
    const { thought } = this.props;

    if (item.slug === "automatic-thought") {
      return (
        <AutomaticThought
          value={thought.automaticThought}
          onChange={this.props.onChangeAutomaticThought}
        />
      );
    }

    if (item.slug === "distortions") {
      return (
        <Distortions
          distortions={thought.cognitiveDistortions}
          onChange={this.props.onChangeDistortion}
          navigation={this.props.navigation}
        />
      );
    }

    if (item.slug === "challenge") {
      return (
        <Challenge
          value={thought.challenge}
          onChange={this.props.onChangeChallenge}
        />
      );
    }

    if (item.slug === "alternative-thought") {
      return (
        <>
          <AlternativeThought
            value={thought.alternativeThought}
            onChange={this.props.onChangeAlternativeThought}
          />
        </>
      );
    }

    return null;
  };

  render() {
    let button;
    if (this.state.activeSlide < 3) {
      button = (
        <ActionButton
          title={i18n.t("next_button")}
          width="100%"
          fillColor={theme.lightGray}
          textColor={theme.darkText}
          onPress={() => {
            haptic.impact(Haptic.ImpactFeedbackStyle.Light);
            this._carousel.snapToNext();
          }}
        />
      )
    } else {
      button = (
        <ActionButton
          title={i18n.t("save_finish")}
          width="100%"
          onPress={this.onSave}
        />
      )
    }

    return (
      <>
        <Carousel
          ref={c => {
            this._carousel = c;
          }}
          data={[
            { slug: "automatic-thought" },
            { slug: "distortions" },
            { slug: "challenge" },
            { slug: "alternative-thought" },
          ]}
          renderItem={this._renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          onSnapToItem={index => {
            this.setState({ activeSlide: index });
            Keyboard.dismiss();
          }}
          firstItem={this.props.slideToIndex(this.props.slideToShow)}
        />
        <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={40}>
          <Row
            style={{
              paddingLeft: 24,
              paddingRight: 24,
              paddingBottom: Platform.OS === 'ios' ? 30 : 0,
            }}
          >
            {button}
          </Row>
        </KeyboardAvoidingView>
      < />
    );
  }
}
