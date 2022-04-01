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

import {
  IGroupedVariable,
  IImagesID,
  IGroupedImagesID,
} from "../../../interfaces";
import { baseConfig } from "../../constants/baseConfig";
export class DocumentCreator {
  public create(link: IImagesID[]): Document {
    const document = new Document();
    const maxWidth = 590;
    document.addSection({
      children: [
        new Paragraph({
          text: baseConfig.STUDENT_REPORT,
          heading: HeadingLevel.TITLE,
        }),
        ...link
          .map((cur: IImagesID) => {
            const arr = [];
            if (cur.id != baseConfig.COURSE_PLAN) {
              if (cur.id == baseConfig.GRAPHIC_ADVANCE) {
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
                if (cur.width > maxWidth) {
                  var aspectRelation = cur.width / cur.height;
                  cur.width = maxWidth;
                  cur.height = maxWidth / aspectRelation;
                }
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
                                Media.addImage(
                                  document,
                                  cur.value,
                                  cur.width,
                                  cur.height
                                )
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
                      left: {
                        size: 0,
                        color: "white",
                        style: BorderStyle.NONE,
                      },
                      right: {
                        size: 0,
                        color: "white",
                        style: BorderStyle.NONE,
                      },
                    },
                  })
                );
              } else if (cur.id == baseConfig.COMPLEMENTARY_INFORMATION) {
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
                                Media.addImage(
                                  document,
                                  cur.value,
                                  cur.width * 0.8,
                                  cur.height * 0.8
                                )
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
                      left: {
                        size: 0,
                        color: "white",
                        style: BorderStyle.NONE,
                      },
                      right: {
                        size: 0,
                        color: "white",
                        style: BorderStyle.NONE,
                      },
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
                                Media.addImage(
                                  document,
                                  cur.value,
                                  cur.width * 0.8,
                                  cur.height * 0.8
                                )
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
                      left: {
                        size: 0,
                        color: "white",
                        style: BorderStyle.NONE,
                      },
                      right: {
                        size: 0,
                        color: "white",
                        style: BorderStyle.NONE,
                      },
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
            }
            return arr;
          })
          .reduce((prev, curr) => prev.concat(curr), []),
      ],
    });
    document.addSection({
      children: [
        new Paragraph({
          text: "",
          heading: HeadingLevel.TITLE,
        }),
        ...link
          .map((cur: IImagesID) => {
            const arr = [];
            if (cur.id == baseConfig.COURSE_PLAN) {
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
              if (cur.width > maxWidth) {
                var aspectRelation = cur.width / cur.height;
                cur.width = maxWidth;
                cur.height = maxWidth / aspectRelation;
              }
              arr.push(
                new Table({
                  rows: [
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [
                            new Paragraph(
                              Media.addImage(
                                document,
                                cur.value,
                                cur.width,
                                cur.height
                              )
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
  public create(
    link: IGroupedImagesID[],
    variables: IGroupedVariable[]
  ): Document {
    let hasTitle = false;
    const maxWidth = 590;
    const document = new Document();

    link.map(({ id }) => {
      if (id === baseConfig.COMPLEMENTARY_INFORMATION) {
        hasTitle = true;
        document.addSection({
          children: [
            new Paragraph({
              text: baseConfig.GROUPED_REPORT_INFORMATION,
              heading: HeadingLevel.TITLE,
            }),
            ...variables
              .map((cur: IGroupedVariable) => {
                const arr2 = [];
                arr2.push(
                  new Paragraph({
                    text: cur.id + ": " + cur.value,
                  })
                );
                return arr2;
              })
              .reduce((prev, curr2) => prev.concat(curr2), []),
            ...link
              .map((cur: IGroupedImagesID) => {
                const arr = [];
                if (cur.id == baseConfig.COMPLEMENTARY_INFORMATION) {
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
                      text: "",
                      alignment: AlignmentType.CENTER,
                    })
                  );
                  cur.texts.map((item) => {
                    arr.push(
                      new Paragraph({
                        children: [new TextRun({ text: item, size: 24 })],
                        alignment: AlignmentType.JUSTIFIED,
                      })
                    );
                  });

                  arr.push(
                    new Paragraph({
                      text: "",
                      alignment: AlignmentType.CENTER,
                    })
                  );
                  arr.push(
                    new Paragraph({
                      children: [
                        new TextRun({ text: cur.secondtext, size: 24 }),
                      ],
                      alignment: AlignmentType.JUSTIFIED,
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
                    new Table({
                      rows: [
                        new TableRow({
                          children: [
                            new TableCell({
                              children: [
                                new Paragraph(
                                  Media.addImage(
                                    document,
                                    cur.value,
                                    cur.width * 0.8,
                                    cur.height * 0.8
                                  )
                                ),
                              ],
                            }),
                          ],
                        }),
                      ],
                      alignment: AlignmentType.CENTER,
                      borders: {
                        top: {
                          size: 0,
                          color: "white",
                          style: BorderStyle.NONE,
                        },
                        bottom: {
                          size: 0,
                          color: "white",
                          style: BorderStyle.NONE,
                        },
                        left: {
                          size: 0,
                          color: "white",
                          style: BorderStyle.NONE,
                        },
                        right: {
                          size: 0,
                          color: "white",
                          style: BorderStyle.NONE,
                        },
                      },
                    })
                  );
                }
                return arr;
              })
              .reduce((prev, curr) => prev.concat(curr), []),
          ],
        });
      }
      if (id === baseConfig.GRAPHIC_ADVANCE) {
        if (!hasTitle) {
          document.addSection({
            children: [
              new Paragraph({
                text: baseConfig.GROUPED_REPORT_INFORMATION,
                heading: HeadingLevel.TITLE,
              }),
              ...variables
                .map((cur: IGroupedVariable) => {
                  const arr2 = [];
                  arr2.push(
                    new Paragraph({
                      text: cur.id + ": " + cur.value,
                    })
                  );
                  return arr2;
                })
                .reduce((prev, curr2) => prev.concat(curr2), []),
              ...link
                .map((cur: IGroupedImagesID) => {
                  const arr = [];
                  if (cur.id === baseConfig.GRAPHIC_ADVANCE) {
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
                        text: "",
                        alignment: AlignmentType.CENTER,
                      })
                    );
                    arr.push(
                      new Paragraph({
                        children: [
                          new TextRun({ text: cur.secondtext, size: 24 }),
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                      })
                    );
                    arr.push(
                      new Paragraph({
                        text: "",
                        alignment: AlignmentType.CENTER,
                      })
                    );

                    if (cur.width > maxWidth) {
                      var aspectRelation = cur.width / cur.height;
                      cur.width = maxWidth;
                      cur.height = maxWidth / aspectRelation;
                    }
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
                                    Media.addImage(
                                      document,
                                      cur.value,
                                      cur.width,
                                      cur.height
                                    )
                                  ),
                                ],
                              }),
                            ],
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                        borders: {
                          top: {
                            size: 0,
                            color: "white",
                            style: BorderStyle.NONE,
                          },
                          bottom: {
                            size: 0,
                            color: "white",
                            style: BorderStyle.NONE,
                          },
                          left: {
                            size: 0,
                            color: "white",
                            style: BorderStyle.NONE,
                          },
                          right: {
                            size: 0,
                            color: "white",
                            style: BorderStyle.NONE,
                          },
                        },
                      })
                    );
                  }
                  return arr;
                })
                .reduce((prev, curr) => prev.concat(curr), []),
            ],
          });
        } else {
          document.addSection({
            children: [
              new Paragraph({
                text: "",
                heading: HeadingLevel.TITLE,
              }),
              ...link
                .map((cur: IGroupedImagesID) => {
                  const arr = [];
                  if (cur.id === baseConfig.GRAPHIC_ADVANCE) {
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
                        text: "",
                        alignment: AlignmentType.CENTER,
                      })
                    );
                    arr.push(
                      new Paragraph({
                        children: [
                          new TextRun({ text: cur.secondtext, size: 24 }),
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                      })
                    );
                    arr.push(
                      new Paragraph({
                        text: "",
                        alignment: AlignmentType.CENTER,
                      })
                    );

                    if (cur.width > maxWidth) {
                      var aspectRelation = cur.width / cur.height;
                      cur.width = maxWidth;
                      cur.height = maxWidth / aspectRelation;
                    }
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
                                    Media.addImage(
                                      document,
                                      cur.value,
                                      cur.width,
                                      cur.height
                                    )
                                  ),
                                ],
                              }),
                            ],
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                        borders: {
                          top: {
                            size: 0,
                            color: "white",
                            style: BorderStyle.NONE,
                          },
                          bottom: {
                            size: 0,
                            color: "white",
                            style: BorderStyle.NONE,
                          },
                          left: {
                            size: 0,
                            color: "white",
                            style: BorderStyle.NONE,
                          },
                          right: {
                            size: 0,
                            color: "white",
                            style: BorderStyle.NONE,
                          },
                        },
                      })
                    );
                  }
                  return arr;
                })
                .reduce((prev, curr) => prev.concat(curr), []),
            ],
          });
        }
      }
      if (id === baseConfig.COURSE_PLAN) {
        document.addSection({
          children: [
            new Paragraph({
              text: "",
              heading: HeadingLevel.TITLE,
            }),
            ...link
              .map((cur: IGroupedImagesID) => {
                const arr = [];
                if (cur.id === baseConfig.COURSE_PLAN) {
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
                      text: "",
                      alignment: AlignmentType.CENTER,
                    })
                  );
                  cur.texts.forEach((item) => {
                    //colors definitions
                    arr.push(
                      new Paragraph({
                        children: [new TextRun({ text: item, size: 22 })],
                        alignment: AlignmentType.JUSTIFIED,
                      })
                    );
                  });
                  arr.push(
                    new Paragraph({
                      children: [new TextRun(""), new TextRun("")],
                      alignment: AlignmentType.JUSTIFIED,
                    })
                  );
                  arr.push(
                    new Paragraph({
                      children: [
                        new TextRun({ text: cur.secondtext, size: 24 }),
                      ],
                      alignment: AlignmentType.JUSTIFIED,
                    })
                  );
                  arr.push(
                    new Paragraph({
                      text: "",
                      alignment: AlignmentType.CENTER,
                    })
                  );
                  if (cur.width > maxWidth) {
                    var aspectRelation = cur.width / cur.height;
                    cur.width = maxWidth;
                    cur.height = maxWidth / aspectRelation;
                  }
                  arr.push(
                    new Table({
                      rows: [
                        new TableRow({
                          children: [
                            new TableCell({
                              children: [
                                new Paragraph(
                                  Media.addImage(
                                    document,
                                    cur.value,
                                    cur.width,
                                    cur.height
                                  )
                                ),
                              ],
                            }),
                          ],
                        }),
                      ],
                      alignment: AlignmentType.CENTER,
                      borders: {
                        top: {
                          size: 0,
                          color: "white",
                          style: BorderStyle.NONE,
                        },
                        bottom: {
                          size: 0,
                          color: "white",
                          style: BorderStyle.NONE,
                        },
                        left: {
                          size: 0,
                          color: "white",
                          style: BorderStyle.NONE,
                        },
                        right: {
                          size: 0,
                          color: "white",
                          style: BorderStyle.NONE,
                        },
                      },
                    })
                  );
                }
                return arr;
              })
              .reduce((prev, curr) => prev.concat(curr), []),
          ],
        });
      }
    });

    return document;
  }
}
