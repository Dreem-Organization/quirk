import React from "react";
import {
  SubHeader,
  RoundedSelector,
  Paragraph,
  ActionButton,
  Row,
} from "../ui";
import { View, ScrollView } from "react-native";
import i18n from "../i18n";
import { CognitiveDistortion } from "../distortions";
import theme from "../theme";
import {
  CBT_LIST_SCREEN,
  EXPLANATION_SCREEN,
  CBT_ON_BOARDING_SCREEN,
  CBT_VIEW_SCREEN,
} from "../screens";

export default ({
  distortions = [],
  onChange,
  navigation
}: {
  distortions: CognitiveDistortion[];
  onChange: (slug: string) => void;
}) => {
  return (
    <>
      <ScrollView>
        <View
          style={{
            paddingBottom: 48,
          }}
        >
          <SubHeader
            style={{
              marginBottom: 6,
            }}
          >
            {i18n.t("cog_distortion")}
          </SubHeader>
          <Paragraph
            style={{
              marginBottom: 18,
            }}
          >
            {i18n.t("main_screen.is_it_distorted")}
          </Paragraph>
          <RoundedSelector items={distortions} onPress={onChange}/>

          <Row
            style={{
              marginTop: 18,
            }}
          >
            <ActionButton
              flex={1}
              title={i18n.t("button_learn_more")}
              fillColor="#EDF0FC"
              textColor={theme.darkBlue}
              width={"100%"}
              onPress={() => {
                  navigation.push(EXPLANATION_SCREEN);
              }}
            />
          </Row>
        </View>
      </ScrollView>
    </>
  );
};
