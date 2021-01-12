import React, { FC, memo, useContext } from "react";
import { Progress } from "semantic-ui-react";
import { Flex, Stack, Text } from "@chakra-ui/react";

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


    
    return (
      <Flex alignItems="center" ml="1em">
        <Flex
          backgroundColor={PROGRESS_STUDENT_INFORMATION_BACKGROUND_COLOR}
          borderRadius="10px 10px 10px 10px"
          alignItems="center"
          color={PROGRESS_STUDENT_INFORMATION_TEXT_COLOR}
          cursor="pointer"
          transition="box-shadow 0.4s ease-in-out"
          data-testid="BoxContainer"
        >
          <Stack className="unselectable" isInline pt={10} pb={10}>
            <div>
              <Text
                fontSize="1.2em"
                ml={5}
                mb={2}
                fontFamily="Lato"
                className="horizontalText"
              >
                {"Avance Bachillerato "}
              </Text>

              <Text width="250px" pr={5} pb={1} mb={0} fontFamily="Lato">
                <Progress
                  precision={0.5}
                  success={true}
                  indicating={true}
                  color="blue"
                  progress="value"
                  value={n_course_approved_bachiller}
                  total={n_course_bachiller}
                />
              </Text>
              <Text fontSize="1.2em" ml={5} mb={2} fontFamily="Lato">
                {"Avance en Licenciatura "}
              </Text>
              <Text width="250px" pr={5} pb={1} mb={0} fontFamily="Lato">
                <Progress
                  precision={1}
                  success={true}
                  indicating={false}
                  progress="value"
                  value={n_course_approved_licentiate}
                  total={n_course_licentiate}
                />
              </Text>
            </div>
          </Stack>
        </Flex>
      </Flex>
    );
  }
);

export default ProgressStudent;
