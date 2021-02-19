import React, { FC, memo } from "react";
import { saveAs } from "file-saver";
import { Packer } from "docx";
import { DocumentCreator } from "../../utils/createWord";
import { Button } from "@chakra-ui/react";
import domtoimage from "dom-to-image";
import { IImagesID } from "../../../../interfaces";
import JSZip from "jszip";
export const DownloadWord: FC<{
  student_id?: string | null;
}> = memo(({ student_id }) => {
  const ids = [
    "Progreso del estudiante",
    "Información Complementaria",
    "Gráfico Avance",
    "Malla",
    "Percentil Riesgo",
  ];

  var zip = new JSZip();
  let lista: IImagesID[] = [];

  const idClicks = ["Percentil Riesgo", "Información Complementaria"];

  const doClick = async () => {
    idClicks.map(async (id) => {
      let input = document.getElementById(id);
      console.log(input);
      if (typeof input !== "undefined" && input !== null) {
        if (
          input.className == "css-1mm8dcq" ||
          input.className == "css-1pjrc6s" ||
          input.className == "css-np2p2s"
        ) {
          input.click();
        }
      }
    });
    await new Promise((r) => setTimeout(r, 250));
  };

  const domImage2 = async () => {
    await doClick();
    await Promise.all(
      ids.map(async (id) => {
        let input = document.getElementById(id);
        if (typeof input !== "undefined" && input !== null) {
          if (id === "Gráfico Avance") {
            const value = await domtoimage.toJpeg(input, { bgcolor: "white" });
            lista.push({ id, value });
          } else if (id === "Malla") {
            const value = await domtoimage.toJpeg(input);
            const value2 = await domtoimage.toBlob(input);
            zip.file("Malla.jpeg", value2, { base64: true });
            lista.push({ id, value });
          } else {
            const value = await domtoimage.toJpeg(input);
            lista.push({ id, value });
          }
        }
      })
    );
    return lista;
  };

  const sendWord = async () => {
    const imagenes = await domImage2();
    console.log(imagenes);
    const documentCreator = new DocumentCreator();
    const doc = documentCreator.create(imagenes);
    await Packer.toBlob(doc).then((blob) => {
      zip.file("test1.docx", blob, { binary: true });
      console.log("Document created successfully");
      zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, "example.zip");
      });
    });
    zip.remove("Malla.jpeg");
    lista = [];
  };

  return (
    <Button cursor="pointer" colorScheme="blue" onClick={sendWord}>
      Download Word
    </Button>
  );
});

export default DownloadWord;
300;
