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
}> = memo(
  ({
    educational_system,
    institution,
    months_to_first_job,
    type_admission,
  }) => {
    const {
      COMPLEMENTARY_INFORMATION,
      COMPLEMENTARY_INFORMATION_BACKGROUND_COLOR,
      COMPLEMENTARY_INFORMATION_EMPLOYED_EDUCATIONAL_SYSTEM,
      COMPLEMENTARY_INFORMATION_EMPLOYED_INSTITUTION,
      COMPLEMENTARY_INFORMATION_EMPLOYED_MONTHS,
      COMPLEMENTARY_INFORMATION_TEXT_COLOR,
      COMPLEMENTARY_INFORMATION_TYPE_ADMISSION,
    } = useContext(ConfigContext);

    const [show, setShow] = useState(false);

    useEffect(() => {
      setTrackingData({
        showingStudentComplementaryInformation: show,
      });
    }, [show]);

    return (
      <Flex alignItems="center" ml="1em">
        <Flex
          id="Información Complementaria"
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
                ? "close-studentComplementaryInfo"
                : "open-studentComplementaryInfo",
              target: "studentComplementaryInfo",
            });
          }}
          color={COMPLEMENTARY_INFORMATION_TEXT_COLOR}
          cursor="pointer"
          transition="box-shadow 0.2s ease-in-out"
          data-testid="BoxContainer"
        >
          <Stack
            className="unselectable"
            isInline
            pt={10}
            pb={10}
            fontFamily="Lato"
          >
            <Text
              minWidth="90px"
              height="150px"
              m={0}
              ml={4}
              textAlign="center"
              fontWeight="bold"
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
                  {type_admission && (
                    <Text width="290px" pl={5} pb={0} mb={0}>
                      {COMPLEMENTARY_INFORMATION_TYPE_ADMISSION}{" "}
                      {type_admission}
                    </Text>
                  )}

                  {educational_system && (
                    <Text width="290px" pl={5} pb={0} mb={0}>
                      {COMPLEMENTARY_INFORMATION_EMPLOYED_EDUCATIONAL_SYSTEM}{" "}
                      {educational_system}
                    </Text>
                  )}

                  {institution && (
                    <Text data-testid="inst" width="290px" pl={5} pb={0} mb={0}>
                      {COMPLEMENTARY_INFORMATION_EMPLOYED_INSTITUTION}{" "}
                      {institution}
                    </Text>
                  )}

                  {months_to_first_job && (
                    <Text width="290px" pl={5} pb={0} mb={0}>
                      {COMPLEMENTARY_INFORMATION_EMPLOYED_MONTHS}{" "}
                      {months_to_first_job}
                    </Text>
                  )}
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
