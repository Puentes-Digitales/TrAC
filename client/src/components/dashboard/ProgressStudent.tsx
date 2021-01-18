import React, { FC, memo, useContext, useEffect, useState } from "react";
import { Progress } from "semantic-ui-react";
import { Flex, Stack, Text, Box } from "@chakra-ui/react";
import { setTrackingData, track } from "../../context/Tracking";

import { ConfigContext } from "../../context/Config";

export const ProgressStudent: FC<{
  n_course_bachiller?: number;
  n_course_approved_bachiller?: number;
  n_course_licentiate?: number;
  n_course_approved_licentiate?: number;
}> = memo(
  ({
    n_course_bachiller,
    n_course_approved_bachiller,
    n_course_licentiate,
    n_course_approved_licentiate,
  }) => {
    const {
      PROGRESS_STUDENT_INFORMATION_BACKGROUND_COLOR,
      PROGRESS_STUDENT_INFORMATION_TEXT_COLOR,
    } = useContext(ConfigContext);

    useEffect(() => {
      setTrackingData({
        showingProgressStudenCycle: true,
      });
      return () => {
        setTrackingData({
          showingProgressStudenCycle: false,
        });
      };
    }, []);

    return (
      <Flex alignItems="center" ml="1em">
        <Flex
          backgroundColor={PROGRESS_STUDENT_INFORMATION_BACKGROUND_COLOR}
          borderRadius="10px 10px 10px 10px"
          alignItems="center"
          color={PROGRESS_STUDENT_INFORMATION_TEXT_COLOR}
          transition="box-shadow 0.4s ease-in-out"
          data-testid="BoxContainer"
        >
          <Stack className="unselectable" isInline pl={5} pt={5} pb={5} pr={3}>
            <Box>
              <Text
                fontSize="1.2em"
                mb={2}
                fontFamily="Lato"
                className="horizontalText"
              >
                {"Avance en Bachillerato "}
              </Text>
              <Flex>
                <Text width="250px" pr={3} pb={1} mb={0} fontFamily="Lato">
                  <Progress
                    precision={0.5}
                    color="blue"
                    progress="value"
                    value={n_course_approved_bachiller}
                    total={n_course_bachiller}
                    percent={50}
                  />
                </Text>

                <Text width="50px" fontFamily="Lato">
                  {(
                    (n_course_approved_bachiller! * 100) /
                    n_course_bachiller!
                  ).toFixed(1)}{" "}
                  %
                </Text>
              </Flex>

              <Text
                fontSize="1.2em"
                mb={2}
                fontFamily="Lato"
                className="horizontalText"
              >
                {"Avance en Licenciatura "}
              </Text>

              <Flex>
                <Text width="250px" pr={3} pb={1} mb={0} fontFamily="Lato">
                  <Progress
                    precision={1}
                    color="blue"
                    progress="value"
                    value={n_course_approved_licentiate}
                    total={n_course_licentiate}
                  />
                </Text>

                <Text width="50" fontFamily="Lato">
                  {(
                    (n_course_approved_licentiate! * 100) /
                    n_course_licentiate!
                  ).toFixed(1)}{" "}
                  %
                </Text>
              </Flex>
            </Box>
          </Stack>
        </Flex>
      </Flex>
    );
  }
);

export default ProgressStudent;
