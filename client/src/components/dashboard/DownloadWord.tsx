import React, { FC, memo, useEffect, useState, useContext } from "react";
import { saveAs } from "file-saver";
import { Packer } from "docx";
import { ConfigContext } from "../../context/Config";

import {
  DocumentCreator,
  DocumentCreatorAgrouped,
} from "../../utils/createWord";
import { Button } from "@chakra-ui/react";
import domtoimage from "dom-to-image";
import { useGroupedActive } from "../../context/DashboardInput";
import {
  IImagesID,
  IGroupedVariable,
  IGroupedImagesID,
} from "../../../../interfaces";
import { setTrackingData, track, TrackingStore } from "../../context/Tracking";
import { useColorMode } from "@chakra-ui/react";
import { baseConfig } from "../../../constants/baseConfig";

import JSZip from "jszip";
export const DownloadWord: FC<{
  student_id?: string | null;
}> = memo(({ student_id }) => {
  const config = useContext(ConfigContext);
  console.log(
    "CONFIG DOWNLOAD: ",
    config.DOWNLOAD_WORD_GROUPED_PLAN_SECOND_TEXT
  );
  const [show, setShow] = useState(false);
  const groupedActive = useGroupedActive();
  const { colorMode } = useColorMode();
  const state = TrackingStore.useStore();

  useEffect(() => {
    setTrackingData({
      showingDownloadButton: show,
    });
  }, [show]);

  const ids = [
    "student_progress",
    "complementary_information",
    "graphic_advance",
    "course_plan",
    "danger_percentile",
  ];

  const selectedIds = [
    "chosenCurriculumComponent",
    "chosenAdmissionTypeComponent",
    "chosenCohortComponent",
  ];

  const groupedIndicators = [
    {
      id: config.GROUPED_COMPLEMENTARY_INFORMATION_TOTAL_STUDENTS,
      value: config.GROUPED_COMPLEMENTARY_INFORMATION_TOTAL_STUDENTS_TOOLTIP,
    },
    {
      id: config.GROUPED_COMPLEMENTARY_INFORMATION_UNIVERSITY_DEGREE_RATE,
      value:
        config.GROUPED_COMPLEMENTARY_INFORMATION_UNIVERSITY_DEGREE_RATE_TOOLTIP,
    },
    {
      id:
        config.GROUPED_COMPLEMENTARY_INFORMATION_AVERAGE_TIME_UNIVERSITY_DEGREE,
      value:
        config.GROUPED_COMPLEMENTARY_INFORMATION_AVERAGE_TIME_UNIVERSITY_DEGREE_TOOLTIP,
    },
    {
      id:
        config.GROUPED_COMPLEMENTARY_INFORMATION_TIMELY_UNIVERSITY_DEGREE_RATE,
      value:
        config.GROUPED_COMPLEMENTARY_INFORMATION_TIMELY_UNIVERSITY_DEGREE_RATE_TOOLTIP,
    },
    {
      id: config.GROUPED_COMPLEMENTARY_INFORMATION_RETENTION_RATE,
      value: config.GROUPED_COMPLEMENTARY_INFORMATION_RETENTION_RATE_TOOLTIP,
    },
    {
      id: config.GROUPED_COMPLEMENTARY_INFORMATION_EMPLEABILITY_RATE,
      value: config.GROUPED_COMPLEMENTARY_INFORMATION_EMPLEABILITY_RATE_TOOLTIP,
    },
    {
      id:
        config.GROUPED_COMPLEMENTARY_INFORMATION_EMPLEABILITY_AVERAGE_TIME_FINDING_JOB,
      value:
        config.GROUPED_COMPLEMENTARY_INFORMATION_EMPLEABILITY_AVERAGE_TIME_FINDING_JOB_TOOLTIP,
    },
    {
      id:
        config.GROUPED_COMPLEMENTARY_INFORMATION_EMPLEABILITY_RATE_EDUCATIONAL_SYSTEM,
      value:
        config.GROUPED_COMPLEMENTARY_INFORMATION_EMPLEABILITY_RATE_EDUCATIONAL_SYSTEM_TOOLTIP,
    },
    {
      id: config.GROUPED_COMPLEMENTARY_INFORMATION_INACTIVE_TIME_RATE,
      value:
        config.GROUPED_COMPLEMENTARY_INFORMATION_INACTIVE_TIME_RATE_TOOLTIP,
    },
  ];

  const courseColorsDefinition = [
    {
      id: "#54278f",
      value: config.DOWNLOAD_WORD_GROUPED_PLAN_TEXT_01,
    },
    {
      id: "#756bb1",
      value: config.DOWNLOAD_WORD_GROUPED_PLAN_TEXT_02,
    },
    {
      id: "#9e9ac8",
      value: config.DOWNLOAD_WORD_GROUPED_PLAN_TEXT_03,
    },
    {
      id: "#cbc9e2",
      value: config.DOWNLOAD_WORD_GROUPED_PLAN_TEXT_04,
    },
    {
      id: "#f2f0f7",
      value: config.DOWNLOAD_WORD_GROUPED_PLAN_TEXT_05,
    },
  ];

  var zip = new JSZip();
  let lista: IImagesID[] = [];
  let groupedList: IGroupedImagesID[] = [];
  let lista2: IGroupedVariable[] = [];

  const idClicks = ["danger_percentile", "complementary_information"];
  const input_click = async (
    condition: boolean | undefined,
    ifTrue: HTMLElement
  ) => (condition === false ? ifTrue.click() : null);

  const doClick = async () => {
    if (colorMode === "dark") {
      let toggle = document.getElementById("toggleTheme");
      toggle!.click();
    }
    idClicks.map(async (id) => {
      let input = document.getElementById(id);
      if (typeof input !== "undefined" && input !== null) {
        switch (id) {
          case "danger_percentile":
            input_click(state.showingPrediction, input);
            break;
          case "complementary_information":
            input_click(state.showingStudentComplementaryInformation, input);
            input_click(state.showingGroupedComplementaryInfo, input);
            break;
        }
      }
    });
    await new Promise((r) => setTimeout(r, 1000));
  };

  const domImage2 = async () => {
    await doClick();
    await Promise.all(
      ids.map(async (id) => {
        let input = document.getElementById(id);
        if (typeof input !== "undefined" && input !== null) {
          if (id === "graphic_advance") {
            const value = await domtoimage.toPng(input, {
              bgcolor: "white",
            });
            lista.push({
              id: baseConfig.GRAPHIC_ADVANCE,
              value,
              text: baseConfig.DOWNLOAD_WORD_STUDENT_TREND_TEXT,
              height: input?.clientHeight,
              width: input.clientWidth,
            });
          } else if (id === "course_plan") {
            const value = await domtoimage.toPng(input);
            const value2 = await domtoimage.toBlob(input);
            zip.file("Malla.jpeg", value2, { base64: true });

            lista.push({
              id: baseConfig.COURSE_PLAN,
              value,
              text: baseConfig.DOWNLOAD_WORD_STUDENT_PLAN_TEXT,
              height: input?.clientHeight,
              width: input.clientWidth,
            });
          } else if (id == "student_progress") {
            const value = await domtoimage.toPng(input);
            lista.push({
              id: baseConfig.STUDENT_PROGRESS,
              value,
              text: baseConfig.DOWNLOAD_WORD_STUDENT_PROGRESS_TEXT,
              height: input?.clientHeight,
              width: input.clientWidth,
            });
          } else {
            const value = await domtoimage.toPng(input);
            lista.push({
              id: baseConfig.COMPLEMENTARY_INFORMATION,
              value,
              text: baseConfig.DOWNLOAD_WORD_STUDENT_COMPLEMENTARY_INFO_TEXT,
              height: input?.clientHeight,
              width: input.clientWidth,
            });
          }
        }
      })
    );

    return lista;
  };
  const domImageGrouped = async () => {
    await doClick();
    await Promise.all(
      ids.map(async (id) => {
        let input = document.getElementById(id);
        if (typeof input !== "undefined" && input !== null) {
          if (id === "graphic_advance") {
            const value = await domtoimage.toPng(input, {
              bgcolor: "white",
            });
            groupedList.push({
              id: baseConfig.GRAPHIC_ADVANCE,
              value,
              text: config.DOWNLOAD_WORD_GROUPED_TREND_TEXT,
              texts: [],
              height: input?.clientHeight,
              width: input.clientWidth,
              secondtext: config.DOWNLOAD_WORD_GROUPED_TREND_SECOND_TEXT,
            });
          } else if (id === "course_plan") {
            const value = await domtoimage.toPng(input);
            const value2 = await domtoimage.toBlob(input);
            const colorsDefinition: string[] = [];
            zip.file("Malla.jpeg", value2, { base64: true });
            courseColorsDefinition.map(({ value }) => {
              colorsDefinition.push(value);
            });
            groupedList.push({
              id: baseConfig.COURSE_PLAN,
              value,
              texts: colorsDefinition,
              text: config.DOWNLOAD_WORD_GROUPED_PLAN_TEXT,
              height: input?.clientHeight,
              width: input.clientWidth,
              secondtext: config.DOWNLOAD_WORD_GROUPED_PLAN_SECOND_TEXT,
            });
          } else {
            const indicators: string[] = [];
            groupedIndicators.map(({ id, value }) => {
              let indicator = id + " " + value;
              indicators.push(indicator);
            });
            const value = await domtoimage.toPng(input);
            groupedList.push({
              id: baseConfig.COMPLEMENTARY_INFORMATION,
              value,
              texts: indicators,
              text: config.DOWNLOAD_WORD_GROUPED_COMPLEMENTARY_INFO_TEXT,
              height: input?.clientHeight,
              width: input.clientWidth,
              secondtext:
                config.DOWNLOAD_WORD_GROUPED_COMPLEMENTARY_INFO_SECOND_TEXT,
            });
          }
        }
      })
    );

    return groupedList;
  };

  const domGroupedVariables = async () => {
    await doClick();
    await Promise.all(
      selectedIds.map((id) => {
        let value = document.getElementById(id)?.children[0]?.textContent;
        if (id == "chosenCurriculumComponent") {
          lista2.push({
            id: baseConfig.CURRICULUM_LABEL,
            value: value || "",
          });
        } else if (id == "chosenAdmissionTypeComponent") {
          lista2.push({
            id: baseConfig.ADMISSION_TYPE_LABEL,
            value: value || "",
          });
        } else {
          lista2.push({
            id: baseConfig.COHORT_LABEL,
            value: value || "",
          });
        }
      })
    );
    return lista2;
  };

  const sendWord = async () => {
    const imagenes = await domImage2();
    const documentCreator = new DocumentCreator();
    const doc = documentCreator.create(imagenes);
    await Packer.toBlob(doc).then((blob) => {
      zip.file("InformeEstudiante.docx", blob, { binary: true });
      zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, "InfomeEstudiante.zip");
      });
    });
    zip.remove("Malla.jpeg");
    lista = [];

    setShow((show) => !show);
    track({
      action: "click",
      effect: "download-word",
      target: "download-word-button",
    });
  };

  const sendWordAgrouped = async () => {
    const imagenes = await domImageGrouped();
    const groupedVariables = await domGroupedVariables();
    const documentCreator = new DocumentCreatorAgrouped();
    const doc = documentCreator.create(imagenes, groupedVariables);
    await Packer.toBlob(doc).then((blob) => {
      zip.file("InformeInfoAgrupada.docx", blob, { binary: true });
      zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, "InformeInfoAgrupada.zip");
      });
    });
    zip.remove("Malla.jpeg");
    lista = [];

    setShow((show) => !show);
    track({
      action: "click",
      effect: "download-word-agrouped",
      target: "download-word-button",
    });
  };

  return (
    <Button
      cursor="pointer"
      colorScheme="blue"
      onClick={groupedActive ? sendWordAgrouped : sendWord}
    >
      {baseConfig.DOWNLOAD_WORD}
    </Button>
  );
});

export default DownloadWord;
300;
