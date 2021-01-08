import React, { FC, memo, useContext } from "react";
import { Progress } from "semantic-ui-react";
import { Flex, Stack, Text } from "@chakra-ui/react";

import { ConfigContext } from "../../context/Config";

export const ProgressStudent: FC<{
  total_asignature?: number;
  approved?: number;
}> = memo(({ total_asignature, approved }) => {
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
                value={approved}
                total={total_asignature}
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
                value={approved}
                t
                otal={total_asignature}
              />
            </Text>
          </div>
        </Stack>
      </Flex>
    </Flex>
  );
});

export default ProgressStudent;
