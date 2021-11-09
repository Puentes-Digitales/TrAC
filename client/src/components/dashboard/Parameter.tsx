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
      loading_type: "Situación académica",
      loading_date: "2019-09-01",
    },
    {
      id: 2,
      loading_type: "Malla:",
      loading_date: "2019-09-02",
    },
    {
      id: 3,
      loading_type: "Indicadores agrupados",
      loading_date: "2019-09-03",
    },
    {
      id: 4,
      loading_type: "Asignaturas inscritas",
      loading_date: "2019-09-03",
    },
    {
      id: 5,
      loading_type: "Asignaturas cursadas",
      loading_date: "2019-09-05",
    },
    {
      id: 6,
      loading_type: "Mock",
      loading_date: "2019-09-06",
    },
    {
      id: 6,
      loading_type: "Empleabilidad",
      loading_date: "2019-09-07",
    },
    {
      id: 7,
      loading_type: "Evaluación inicial",
      loading_date: "2019-09-07",
    },
    {
      id: 8,
      loading_type: "Evaluación nacional",
      loading_date: "2019-09-08",
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
        <PopoverHeader fontWeight="bold">
          {LAST_UPDATE_DATA}
          {":"}
        </PopoverHeader>
        <PopoverBody>
          <UnorderedList>
            {!mockIsActive
              ? parameters_date?.map((data) => {
                  return data ? (
                    <ListItem key={data.loading_type}>
                      {data.loading_type}
                      {": "}
                      <b>{data.loading_date}</b>
                    </ListItem>
                  ) : null;
                })
              : data_mock.map((data) => {
                  return data ? (
                    <ListItem key={data.loading_type}>
                      {data.loading_type}
                      {": "}
                      <b>{data.loading_date}</b>
                    </ListItem>
                  ) : null;
                })}
          </UnorderedList>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
});
