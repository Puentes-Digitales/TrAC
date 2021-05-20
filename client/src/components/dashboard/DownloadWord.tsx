import React, { FC, memo, useEffect, useState } from "react";
import { saveAs } from "file-saver";
import { Packer } from "docx";
import {
  DocumentCreator,
  DocumentCreatorAgrouped,
} from "../../utils/createWord";
import { Button } from "@chakra-ui/react";
import domtoimage from "dom-to-image";
import { useGroupedActive } from "../../context/DashboardInput";
import { IImagesID } from "../../../../interfaces";
import { setTrackingData, track } from "../../context/Tracking";
import { useColorMode } from "@chakra-ui/react";
import { baseConfig } from "../../../constants/baseConfig";

import JSZip from "jszip";
export const DownloadWord: FC<{
  student_id?: string | null;
}> = memo(({ student_id }) => {
  const [show, setShow] = useState(false);
  const groupedActive = useGroupedActive();
  const { colorMode } = useColorMode();

  useEffect(() => {
    setTrackingData({
      showingDownloadButton: show,
    });
  }, [show]);

  const ids = [
    "student_progress",
    "complementary_information",
    "graphic_advance",
    "Malla",
    "Percentil Riesgo",
  ];

  var zip = new JSZip();
  let lista: IImagesID[] = [];

  const idClicks = ["Percentil Riesgo", "complementary_information"];

  const doClick = async () => {
    if (colorMode === "dark") {
      console.log("color");
      let toggle = document.getElementById("toggleTheme");
      toggle!.click();
    }
    idClicks.map(async (id) => {
      let input = document.getElementById(id);
      console.log("AQUI EL INPUT", input);

      if (typeof input !== "undefined" && input !== null) {
        console.log(input.className);
        if (
          input.className == "css-1mm8dcq" ||
          input.className == "css-1pjrc6s" ||
          input.className == "css-np2p2s"
        ) {
          input.click();
          console.log("ENTRA AL IF");
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
            const value = await domtoimage.toPng(input, { bgcolor: "white" });
            lista.push({ id, value });
          } else if (id === "Malla") {
            const value = await domtoimage.toPng(input);
            const value2 = await domtoimage.toBlob(input);
            zip.file("Malla.jpeg", value2, { base64: true });
            lista.push({ id, value });
          } else {
            const value = await domtoimage.toPng(input);
            lista.push({ id, value });
          }
        }
      })
    );
    return lista;
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
    const imagenes = await domImage2();
    const documentCreator = new DocumentCreatorAgrouped();
    const doc = documentCreator.create(imagenes);
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
