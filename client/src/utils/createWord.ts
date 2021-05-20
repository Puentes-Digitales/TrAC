import { AlignmentType, Document, HeadingLevel, Media, Paragraph } from "docx";

import { IImagesID } from "../../../interfaces";
import { baseConfig } from "../../constants/baseConfig";
export class DocumentCreator {
  public create(link: IImagesID[]): Document {
    const document = new Document();
    document.addSection({
      children: [
        new Paragraph({
          text: baseConfig.STUDENT_REPORT,
          heading: HeadingLevel.TITLE,
        }),
        ...link
          .map((cur: IImagesID) => {
            const arr = [];
            arr.push(
              new Paragraph({
                text: cur.id,
                alignment: AlignmentType.CENTER,
                heading: HeadingLevel.HEADING_2,
              })
            );
            if (cur.id == "Malla") {
              arr.push(
                new Paragraph(Media.addImage(document, cur.value, 650, 400))
              );
            } else {
              arr.push(
                new Paragraph(Media.addImage(document, cur.value, 600, 250))
              );
            }
            return arr;
          })
          .reduce((prev, curr) => prev.concat(curr), []),
      ],
    });

    return document;
  }
}

export class DocumentCreatorAgrouped {
  public create(link: IImagesID[]): Document {
    const document = new Document();
    document.addSection({
      children: [
        new Paragraph({
          text: baseConfig.GROUPED_REPORT_INFORMATION,
          heading: HeadingLevel.TITLE,
        }),
        ...link
          .map((cur: IImagesID) => {
            const arr = [];
            arr.push(
              new Paragraph({
                text: cur.id,
                alignment: AlignmentType.CENTER,
                heading: HeadingLevel.HEADING_2,
              })
            );
            arr.push(
              new Paragraph(Media.addImage(document, cur.value, 600, 250))
            );
            return arr;
          })
          .reduce((prev, curr) => prev.concat(curr), []),
      ],
    });

    return document;
  }
}
