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
  mockIsActive?: boolean;
}> = memo(({ mockIsActive }) => {
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

  let data_mock = [
    {
      id: 1,
      loading_type: "Datos mock",
      loading_date: "2019-09-25",
    },
    {
      id: 2,
      loading_type: "Datos agrupados",
      loading_date: "2019-09-26",
    },
    {
      id: 3,
      loading_type: "Datos empleabilidad",
      loading_date: "2019-09-27",
    },
    {
      id: 4,
      loading_type: "Datos académicos",
      loading_date: "2019-09-22",
    },
  ];

  return (
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
            {!mockIsActive
              ? parameters_date?.map((data) => {
                  return data ? (
                    <ListItem key={data.loading_type}>
                      {data.loading_type}
                      {": "}
                      {data.loading_date}
                    </ListItem>
                  ) : null;
                })
              : data_mock.map((data) => {
                  return data ? (
                    <ListItem key={data.loading_type}>
                      {data.loading_type}
                      {": "}
                      {data.loading_date}
                    </ListItem>
                  ) : null;
                })}
          </UnorderedList>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
});
