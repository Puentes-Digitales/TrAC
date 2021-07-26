import React, { FC } from "react";
import {
  Text,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useColorModeValue,
} from "@chakra-ui/react";

export const IndicatorTooltip: FC<{
  tooltipShow: string;
}> = ({ tooltipShow }) => {
  const textColor = useColorModeValue("black", "white");

  return tooltipShow ? (
    <Popover trigger="hover" isLazy placement="right">
      <PopoverTrigger>
        <Icon ml={1} mb={1} size="13px" cursor="help" />
      </PopoverTrigger>
      <PopoverContent
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
    </Popover>
  ) : null;
};
