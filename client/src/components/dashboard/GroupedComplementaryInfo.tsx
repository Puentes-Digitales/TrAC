import React, { FC, memo, useContext, useEffect } from "react";

import { Flex, Stack, Text, Box } from "@chakra-ui/react";

import { ConfigContext } from "../../context/Config";
import { setTrackingData } from "../../context/Tracking";

export const GroupedComplementaryInfo: FC<{
  total_students?: number | null;
  timely_university_degree_rate?: number | null;
  university_degree_rate?: number | null;
  retention_rate?: number | null;
  average_time_university_degree?: number | null;
}> = memo(
  ({
    total_students,
    university_degree_rate,
    average_time_university_degree,
    timely_university_degree_rate,
    retention_rate,
  }) => {
    const {
      COMPLEMENTARY_INFORMATION_BACKGROUND_COLOR,
      COMPLEMENTARY_INFORMATION_TEXT_COLOR,
      COMPLEMENTARY_INFORMATION,
      COMPLEMENTARY_INFORMATION_TOTAL_STUDENTS,
      COMPLEMENTARY_INFORMATION_TIMELY_UNIVERSITY_DEGREE_RATE,
      COMPLEMENTARY_INFORMATION_UNIVERSITY_DEGREE_RATE,
      COMPLEMENTARY_INFORMATION_AVERAGE_TIME_UNIVERSITY_DEGREE,
      COMPLEMENTARY_INFORMATION_RETENTION_RATE,
    } = useContext(ConfigContext);

    useEffect(() => {
      setTrackingData({
        showingGroupedComplementaryInfo: true,
      });
      return () => {
        setTrackingData({
          showingGroupedComplementaryInfo: false,
        });
      };
    }, []);

    return (
      <Flex alignItems="center" ml="1em">
        <Flex
          backgroundColor={COMPLEMENTARY_INFORMATION_BACKGROUND_COLOR}
          borderRadius={"5px 5px 5px 5px"}
          alignItems="center"
          color={COMPLEMENTARY_INFORMATION_TEXT_COLOR}
          cursor="pointer"
          transition="box-shadow 0.4s ease-in-out"
          data-testid="BoxContainer"
        >
          <Stack className="unselectable" isInline pt={10} pb={10}>
            <Text
              minWidth="60px"
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
            <Box>
              <div>
                {total_students && (
                  <Text width="290px" pl={5} pb={0} mb={0} fontFamily="Lato">
                    {COMPLEMENTARY_INFORMATION_TOTAL_STUDENTS} {total_students}
                  </Text>
                )}

                {timely_university_degree_rate && (
                  <Text width="290px" pl={5} pb={0} mb={0} fontFamily="Lato">
                    {COMPLEMENTARY_INFORMATION_TIMELY_UNIVERSITY_DEGREE_RATE}{" "}
                    {timely_university_degree_rate}
                  </Text>
                )}

                {university_degree_rate && (
                  <Text width="290px" pl={5} pb={0} mb={0} fontFamily="Lato">
                    {COMPLEMENTARY_INFORMATION_UNIVERSITY_DEGREE_RATE}{" "}
                    {university_degree_rate}
                  </Text>
                )}

                {average_time_university_degree && (
                  <Text width="290px" pl={5} pb={0} mb={0} fontFamily="Lato">
                    {COMPLEMENTARY_INFORMATION_AVERAGE_TIME_UNIVERSITY_DEGREE}{" "}
                    {average_time_university_degree}
                  </Text>
                )}

                {retention_rate && (
                  <Text width="290px" pl={5} pb={0} mb={0} fontFamily="Lato">
                    {COMPLEMENTARY_INFORMATION_RETENTION_RATE} {retention_rate}
                  </Text>
                )}
              </div>
            </Box>
          </Stack>
        </Flex>
      </Flex>
    );
  }
);

export default GroupedComplementaryInfo;
