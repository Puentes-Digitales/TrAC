import React, { FC, memo, useContext, useEffect } from "react";
import { Progress } from "semantic-ui-react";
import { Flex, Stack, Text, Box } from "@chakra-ui/react";
import { setTrackingData } from "../../context/Tracking";
import { ConfigContext } from "../../context/Config";

export const ProgressStudent: FC<{
  n_cycles_student: string[];
  n_courses_cycles: number[];
  n_credits_passed: number;
}> = memo(({ n_cycles_student, n_courses_cycles, n_credits_passed }) => {
  const {
    PROGRESS_STUDENT_INFORMATION_BACKGROUND_COLOR,
    PROGRESS_STUDENT_INFORMATION_TEXT,
    PROGRESS_STUDENT_NOTE,
    CREDITS_PASSED_LABEL,
    COMPLEMENTARY_INFORMATION_PERCENT_MARK,
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
        color="black"
        transition="box-shadow 0.4s ease-in-out"
        data-testid="BoxContainer"
        id="student_progress"
      >
        <Stack className="unselectable" isInline pl={5} pt={5} pb={5} pr={3}>
          <Box>
            {n_cycles_student.map((cycle, i) => (
              <div>
                <Text
                  fontSize="1.2em"
                  mb={2}
                  fontFamily="Lato"
                  className="horizontalText"
                >
                  {PROGRESS_STUDENT_INFORMATION_TEXT} {cycle}
                </Text>
                <Flex>
                  <Text width="250px" pr={3} pb={1} mb={0} fontFamily="Lato">
                    <Progress
                      precision={0.5}
                      color="blue"
                      progress="value"
                      value={n_courses_cycles[2 * i + 1]}
                      total={n_courses_cycles[2 * i]}
                    />
                  </Text>
                  <Text width="50px" fontFamily="Lato">
                    {(
                      (((n_courses_cycles[2 * i + 1] ?? 0) * 100) /
                        (n_courses_cycles[2 * i] ?? 1)) |
                      0
                    ).toFixed(1)}{" "}
                    {COMPLEMENTARY_INFORMATION_PERCENT_MARK}
                  </Text>
                </Flex>
              </div>
            ))}
            <div>
              <Text
                alignSelf={"center"}
                fontSize="1.2em"
                ml={2}
                mb={2}
                fontFamily="Lato"
                className="horizontalText"
              >
                {CREDITS_PASSED_LABEL + n_credits_passed}
              </Text>
              <Text
                alignSelf={"center"}
                fontSize="0.9em"
                ml={4}
                mb={2}
                fontFamily="Lato"
                className="horizontalText"
              >
                {PROGRESS_STUDENT_NOTE}
              </Text>
            </div>
          </Box>
        </Stack>
      </Flex>
    </Flex>
  );
});

export default ProgressStudent;
