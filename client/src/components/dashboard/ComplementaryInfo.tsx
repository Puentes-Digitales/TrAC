import { AnimatePresence, motion } from "framer-motion";
import React, { FC, memo, useContext, useEffect, useState } from "react";

import { Flex, Stack, Text } from "@chakra-ui/react";

import { ConfigContext } from "../../context/Config";
import { setTrackingData, track } from "../../context/Tracking";
import { IndicatorTooltip } from "../IndicatorTooltip";

export const ComplementaryInfo: FC<{
  employed?: boolean | null;
  educational_system?: boolean | null;
  institution?: string | null;
  months_to_first_job?: number | null;
  type_admission?: string | null;
}> = memo(
  ({
    employed,
    educational_system,
    institution,
    months_to_first_job,
    type_admission,
  }) => {
    const {
      NO_INFORMATION,
      EMPLOYED_TRUE,
      EMPLOYED_FALSE,
      EDUCATIONAL_SYSTEM_TRUE,
      EDUCATIONAL_SYSTEM_FALSE,
      COMPLEMENTARY_INFORMATION,
      COMPLEMENTARY_INFORMATION_EMPLOYED_TOOLTIP,
      COMPLEMENTARY_INFORMATION_EMPLOYED,
      COMPLEMENTARY_INFORMATION_BACKGROUND_COLOR,
      COMPLEMENTARY_INFORMATION_EMPLOYED_EDUCATIONAL_SYSTEM,
      COMPLEMENTARY_INFORMATION_EMPLOYED_INSTITUTION,
      COMPLEMENTARY_INFORMATION_EMPLOYED_MONTHS,
      COMPLEMENTARY_INFORMATION_TEXT_COLOR,
      COMPLEMENTARY_INFORMATION_TYPE_ADMISSION,
      COMPLEMENTARY_INFORMATION_TYPE_ADMISSION_TOOLTIP,
      COMPLEMENTARY_INFORMATION_EMPLOYED_EDUCATIONAL_SYSTEM_TOOLTIP,
      COMPLEMENTARY_INFORMATION_EMPLOYED_INSTITUTION_TOOLTIP,
      COMPLEMENTARY_INFORMATION_EMPLOYED_MONTHS_TOOLTIP,
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
          id="complementary_information"
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
            alignItems="center"
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
                    <Flex minWidth="max-content" pr={5} pl={0} pt={1} pb={1}>
                      <Text>
                        {COMPLEMENTARY_INFORMATION_TYPE_ADMISSION}{" "}
                        {type_admission}
                      </Text>
                      <IndicatorTooltip
                        tooltipShow={
                          COMPLEMENTARY_INFORMATION_TYPE_ADMISSION_TOOLTIP
                        }
                      ></IndicatorTooltip>
                    </Flex>
                  )}

                  {typeof employed == "boolean" && (
                    <Flex minWidth="max-content" pr={5} pl={0} pt={1} pb={1}>
                      <Text>
                        {COMPLEMENTARY_INFORMATION_EMPLOYED}{" "}
                        {employed == true ? EMPLOYED_TRUE : EMPLOYED_FALSE}
                      </Text>
                      <IndicatorTooltip
                        tooltipShow={COMPLEMENTARY_INFORMATION_EMPLOYED_TOOLTIP}
                      ></IndicatorTooltip>
                    </Flex>
                  )}

                  {typeof employed == "boolean" && (
                    <Flex minWidth="max-content" pr={5} pl={0} pt={1} pb={1}>
                      <Text>
                        {COMPLEMENTARY_INFORMATION_EMPLOYED_EDUCATIONAL_SYSTEM}{" "}
                        {typeof educational_system == "boolean"
                          ? educational_system == true
                            ? EDUCATIONAL_SYSTEM_TRUE
                            : EDUCATIONAL_SYSTEM_FALSE
                          : NO_INFORMATION}
                      </Text>
                      <IndicatorTooltip
                        tooltipShow={
                          COMPLEMENTARY_INFORMATION_EMPLOYED_EDUCATIONAL_SYSTEM_TOOLTIP
                        }
                      ></IndicatorTooltip>
                    </Flex>
                  )}

                  {typeof employed == "boolean" && (
                    <Flex
                      minWidth="max-content"
                      data-testid="inst"
                      pr={5}
                      pl={0}
                      pt={1}
                      pb={1}
                    >
                      <Text>
                        {COMPLEMENTARY_INFORMATION_EMPLOYED_INSTITUTION}{" "}
                        {typeof institution == "string"
                          ? institution
                          : NO_INFORMATION}
                      </Text>
                      <IndicatorTooltip
                        tooltipShow={
                          COMPLEMENTARY_INFORMATION_EMPLOYED_INSTITUTION_TOOLTIP
                        }
                      ></IndicatorTooltip>
                    </Flex>
                  )}

                  {typeof employed == "boolean" ? (
                    <Flex minWidth="max-content" pr={5} pl={0} pt={1} pb={1}>
                      <Text>
                        {COMPLEMENTARY_INFORMATION_EMPLOYED_MONTHS}{" "}
                        {typeof months_to_first_job == "number"
                          ? months_to_first_job
                          : NO_INFORMATION}
                      </Text>
                      <IndicatorTooltip
                        tooltipShow={
                          COMPLEMENTARY_INFORMATION_EMPLOYED_MONTHS_TOOLTIP
                        }
                      ></IndicatorTooltip>
                    </Flex>
                  ) : null}
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
