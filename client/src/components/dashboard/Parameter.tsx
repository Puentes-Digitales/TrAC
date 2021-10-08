import {
  Button,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  PopoverArrow,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import React, { FC, memo, useContext } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useParametersQuery } from "../../graphql";
import { format } from "date-fns-tz";
import { ConfigContext } from "../../context/Config";

export const Parameter: FC<{
  show?: string | null;
}> = memo(({ show }) => {
  const { data: parameters } = useParametersQuery();
  const dateFormatStringTemplate = "dd-MM-yyyy";
  const parameters_date = parameters?.parameters
    ?.map((params) => {
      return {
        id: params.id,
        loading_type: params.loading_type,
        loading_date: format(
          new Date(params.loading_date),
          dateFormatStringTemplate,
          {
            timeZone: "America/Santiago",
          }
        ),
      };
    })
    .reverse();
  const { LAST_UPDATE_DATA } = useContext(ConfigContext);

  return show ? (
    <Popover trigger="hover" isLazy placement="bottom">
      <PopoverTrigger>
        <Button mr="4px" ml="2px" colorScheme="blue" size="md" p="10px">
          <AiOutlineInfoCircle cursor="pointer" size="17px" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverCloseButton />
        <PopoverArrow />
        <PopoverHeader fontWeight="bold">{LAST_UPDATE_DATA}</PopoverHeader>
        <PopoverBody>
          <UnorderedList>
            {parameters_date?.map((date) => {
              return date ? (
                <ListItem key={date.id}>
                  {date.loading_type}
                  {": "}
                  {date.loading_date}
                </ListItem>
              ) : null;
            })}
          </UnorderedList>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  ) : null;
});
