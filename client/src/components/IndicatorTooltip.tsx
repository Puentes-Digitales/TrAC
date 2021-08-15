import React, { FC, memo } from "react";
import {
  Text,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useColorModeValue,
  Portal,
} from "@chakra-ui/react";

export const IndicatorTooltip: FC<{
  tooltipShow?: string | null;
}> = memo(({ tooltipShow }) => {
  const textColor = useColorModeValue("black", "white");

  return tooltipShow ? (
    <Popover trigger="hover" isLazy placement="right">
      <PopoverTrigger>
        <Icon
          data-testid="test-tooltip"
          ml={"4px"}
          mb={0}
          mt={"2px"}
          size="13px"
          cursor="help"
        />
      </PopoverTrigger>
      <Portal>
        <PopoverContent
          justify="center"
          width="fit-content"
          padding="5px"
          color={textColor}
          alignItems="center"
        >
          <PopoverArrow />
          <PopoverBody>
            <Text>{tooltipShow}</Text>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  ) : null;
});
