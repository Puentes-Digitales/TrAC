import {
  Button,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  PopoverArrow,
} from "@chakra-ui/react";
import React, { FC, memo } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useParametersQuery } from "../../graphql";

import { format } from "date-fns-tz";

export const Parameter: FC<{
  show?: string | null;
}> = memo(({ show }) => {
  const { data: parameters } = useParametersQuery();
  const dateFormatStringTemplate = "dd-MM-yyyy";
  console.log(parameters);
  const last_loading_date = parameters?.parameters?.map((params) => {
    console.log(params.id);
    console.log(params.loading_type);
    console.log(params.loading_date);
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
  });

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
        <PopoverHeader fontWeight="bold">
          Fecha de última carga de datos
        </PopoverHeader>
        <PopoverBody>
          {last_loading_date?.map((date) => {
            return (
              <li key={date.id}>
                {date.loading_type}
                {": "}
                {date.loading_date}
              </li>
            );
          })}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  ) : null;
});
