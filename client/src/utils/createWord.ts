import {
  AlignmentType,
  Document,
  HeadingLevel,
  Media,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  TextRun,
} from "docx";

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
            console.log("id:", cur.id);
            const arr = [];
            arr.push(
              new Paragraph({
                text: "",
                alignment: AlignmentType.CENTER,
              })
            );
            arr.push(
              new Paragraph({
                text: "",
                alignment: AlignmentType.CENTER,
              })
            );
            arr.push(
              new Paragraph({
                text: cur.id,
                alignment: AlignmentType.CENTER,
                heading: HeadingLevel.HEADING_2,
              })
            );
            arr.push(
              new Paragraph({
                text: "",
                alignment: AlignmentType.CENTER,
              })
            );
            arr.push(
              new Paragraph({
                text: "",
                alignment: AlignmentType.CENTER,
              })
            );
            arr.push(
              new Paragraph({
                children: [new TextRun({ text: cur.text, size: 24 })],
                alignment: AlignmentType.JUSTIFIED,
              })
            );
            arr.push(
              new Paragraph({
                children: [new TextRun(""), new TextRun("")],
                alignment: AlignmentType.JUSTIFIED,
              })
            );

            if (cur.id == baseConfig.COURSE_PLAN) {
              arr.push(
                new Table({
                  rows: [
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [
                            new Paragraph(
                              Media.addImage(document, cur.value, 600, 350)
                            ),
                          ],
                        }),
                      ],
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                  borders: {
                    top: { size: 0, color: "white", style: BorderStyle.NONE },
                    bottom: {
                      size: 0,
                      color: "white",
                      style: BorderStyle.NONE,
                    },
                    left: { size: 0, color: "white", style: BorderStyle.NONE },
                    right: { size: 0, color: "white", style: BorderStyle.NONE },
                  },
                })
              );
            } else if (cur.id == baseConfig.GRAPHIC_ADVANCE) {
              arr.push(
                new Paragraph({
                  text: "",
                  alignment: AlignmentType.CENTER,
                })
              );
              arr.push(
                new Paragraph({
                  text: "",
                  alignment: AlignmentType.CENTER,
                })
              );
              arr.push(
                new Table({
                  rows: [
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [
                            new Paragraph(
                              Media.addImage(document, cur.value, 600, 200)
                            ),
                          ],
                        }),
                      ],
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                  borders: {
                    top: { size: 0, color: "white", style: BorderStyle.NONE },
                    bottom: {
                      size: 0,
                      color: "white",
                      style: BorderStyle.NONE,
                    },
                    left: { size: 0, color: "white", style: BorderStyle.NONE },
                    right: { size: 0, color: "white", style: BorderStyle.NONE },
                  },
                })
              );
            } else {
              arr.push(
                new Paragraph({
                  text: "",
                  alignment: AlignmentType.CENTER,
                })
              );
              arr.push(
                new Paragraph({
                  text: "",
                  alignment: AlignmentType.CENTER,
                })
              );
              arr.push(
                new Table({
                  rows: [
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [
                            new Paragraph(
                              Media.addImage(document, cur.value, 300, 200)
                            ),
                          ],
                        }),
                      ],
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                  borders: {
                    top: { size: 0, color: "white", style: BorderStyle.NONE },
                    bottom: {
                      size: 0,
                      color: "white",
                      style: BorderStyle.NONE,
                    },
                    left: { size: 0, color: "white", style: BorderStyle.NONE },
                    right: { size: 0, color: "white", style: BorderStyle.NONE },
                  },
                })
              );
              arr.push(
                new Paragraph({
                  text: "",
                  alignment: AlignmentType.CENTER,
                })
              );
              arr.push(
                new Paragraph({
                  text: "",
                  alignment: AlignmentType.CENTER,
                })
              );
              arr.push(
                new Paragraph({
                  text: "",
                  alignment: AlignmentType.CENTER,
                })
              );
              arr.push(
                new Paragraph({
                  text: "",
                  alignment: AlignmentType.CENTER,
                })
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
