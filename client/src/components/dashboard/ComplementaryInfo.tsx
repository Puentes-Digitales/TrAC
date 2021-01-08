import { AnimatePresence, motion } from "framer-motion";
import React, { FC, memo, useContext, useEffect, useState } from "react";

import { Flex, Stack, Text } from "@chakra-ui/react";

import { ConfigContext } from "../../context/Config";
import { setTrackingData, track } from "../../context/Tracking";

export const ComplementaryInfo: FC<{
  educational_system?: string | null;
  institution?: string | null;
  months_to_first_job?: number | null;
  type_admission?: string | null;
  initial_test?: number | null;
  final_test?: number | null;
}> = memo(
  ({
    educational_system,
    institution,
    months_to_first_job,
    type_admission,
    initial_test,
    final_test,
  }) => {
    const {
      COMPLEMENTARY_INFORMATION,
      COMPLEMENTARY_INFORMATION_BACKGROUND_COLOR,
      COMPLEMENTARY_INFORMATION_EMPLOYED_EDUCATIONAL_SYSTEM,
      COMPLEMENTARY_INFORMATION_EMPLOYED_INSTITUTION,
      COMPLEMENTARY_INFORMATION_EMPLOYED_MONTHS,
      COMPLEMENTARY_INFORMATION_FINAL_TEST,
      COMPLEMENTARY_INFORMATION_INITIAL_TEST,
      COMPLEMENTARY_INFORMATION_TEXT_COLOR,
      COMPLEMENTARY_INFORMATION_TYPE_ADMISSION,
    } = useContext(ConfigContext);

    const [show, setShow] = useState(false);

    useEffect(() => {
      setTrackingData({
        showingComplementaryInformation: show,
      });
    }, [show]);

    if (institution == null) return null;

    return (
      <Flex alignItems="center" ml="1em">
        <Flex
          backgroundColor={COMPLEMENTARY_INFORMATION_BACKGROUND_COLOR}
          boxShadow={
            show
              ? "0px 0px 2px 1px rgb(174,174,174)"
              : "2px 3px 2px 1px rgb(174,174,174)"
          }
          borderRadius={show ? "5px 5px 5px 5px" : "0px 5px 5px 0px"}
          alignItems="center"
          onClick={() => {
            setShow((show) => !show);

            track({
              action: "click",
              effect: show
                ? "close-complementaryInfo"
                : "open-complementaryInfo",
              target: "complementaryInfo",
            });
          }}
          color={COMPLEMENTARY_INFORMATION_TEXT_COLOR}
          cursor="pointer"
          transition="box-shadow 0.4s ease-in-out"
          data-testid="BoxContainer"
        >
          <Stack className="unselectable" isInline pt={10} pb={10}>
            <Text
              minWidth="90px"
              height="120px"
              m={0}
              ml={4}
              textAlign="center"
              fontWeight="bold"
              fontFamily="Lato"
              className="verticalText"
              fontSize="1.1em"
            >
              {COMPLEMENTARY_INFORMATION}
            </Text>
            <AnimatePresence>
              {show && (
                <motion.div
                  key="employed-text"
                  initial={{
                    opacity: 0,
                  }}
                  animate={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                  }}
                >
                  <Text width="290px" pl={5} pb={0} mb={0} fontFamily="Lato">
                    {COMPLEMENTARY_INFORMATION_TYPE_ADMISSION} {type_admission}
                  </Text>

                  <Text width="290px" pl={5} pb={0} mb={0} fontFamily="Lato">
                    {COMPLEMENTARY_INFORMATION_INITIAL_TEST} {initial_test}
                  </Text>
                  <Text width="290px" pl={5} pb={0} mb={0} fontFamily="Lato">
                    {COMPLEMENTARY_INFORMATION_FINAL_TEST} {final_test}
                  </Text>
                  <Text width="320px" pl={5} pb={0} mb={0} fontFamily="Lato">
                    {COMPLEMENTARY_INFORMATION_EMPLOYED_EDUCATIONAL_SYSTEM}{" "}
                    {educational_system}
                  </Text>
                  <Text width="350px" pl={5} pb={0} mb={0} fontFamily="Lato">
                    {COMPLEMENTARY_INFORMATION_EMPLOYED_INSTITUTION}{" "}
                    {institution}
                  </Text>
                  <Text width="290px" pl={5} pb={0} mb={0} fontFamily="Lato">
                    {COMPLEMENTARY_INFORMATION_EMPLOYED_MONTHS}{" "}
                    {months_to_first_job}
                  </Text>
                </motion.div>
              )}
            </AnimatePresence>
          </Stack>
        </Flex>
      </Flex>
    );
  }
);

export default ComplementaryInfo;
