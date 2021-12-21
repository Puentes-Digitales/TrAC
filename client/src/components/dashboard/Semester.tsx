import React, { FC, useContext } from "react";

import { Stack, StackProps, Text } from "@chakra-ui/react";

import { ICourse, IExternalEvaluation } from "../../../../interfaces";
import { ConfigContext } from "../../context/Config";
import { CourseBox } from "./CourseBox/CourseBox";
import { ExternalEvaluationBox } from "./CourseBox/ExternalEvaluationBox";

const toRoman = (num: number, first = false): string => {
  if (first && num === 0) {
    return "-";
  }
  if (num < 1) {
    return "";
  }
  if (num >= 40) {
    return "XL" + toRoman(num - 40);
  }
  if (num >= 10) {
    return "X" + toRoman(num - 10);
  }
  if (num >= 9) {
    return "IX" + toRoman(num - 9);
  }
  if (num >= 5) {
    return "V" + toRoman(num - 5);
  }
  if (num >= 4) {
    return "IV" + toRoman(num - 4);
  }
  if (num >= 1) {
    return "I" + toRoman(num - 1);
  }
  return "";
};

export const Semester: FC<
  {
    student_mention: string;
    courses: ICourse[];
    externalEvaluations: IExternalEvaluation[];
    n: number;
  } & StackProps
> = ({
  courses: semesterCourse,
  externalEvaluations: semesterExternalEvaluation,
  n,
  mr,
  student_mention,
  ...stackProps
}) => {
  const { SEMESTER_HEADER_TEXT_COLOR, SEMESTER_HEADER_FONT_SIZE } = useContext(
    ConfigContext
  );

  if (student_mention == "") {
    return (
      <Stack {...stackProps} height="fit-content">
        <Text
          color={SEMESTER_HEADER_TEXT_COLOR}
          textAlign="center"
          fontSize={SEMESTER_HEADER_FONT_SIZE}
        >
          <b>{toRoman(n, true)}</b>
        </Text>

        {semesterExternalEvaluation.map((externalEvaluations) => (
          <ExternalEvaluationBox
            key={externalEvaluations.code}
            {...externalEvaluations}
          />
        ))}
        {semesterCourse.map((course) => (
          <CourseBox key={course.code} {...course} />
        ))}
      </Stack>
    );
  } else {
    return (
      <Stack {...stackProps} height="fit-content">
        <Text
          color={SEMESTER_HEADER_TEXT_COLOR}
          textAlign="center"
          fontSize={SEMESTER_HEADER_FONT_SIZE}
        >
          <b>{toRoman(n, true)}</b>
        </Text>

        {semesterExternalEvaluation.map((externalEvaluations) => (
          <ExternalEvaluationBox
            key={externalEvaluations.code}
            {...externalEvaluations}
          />
        ))}
        {semesterCourse.map(
          (course) =>
            student_mention == course.mention && (
              <CourseBox key={course.code} {...course} />
            )
        )}

        {semesterCourse.map(
          (course) =>
            "" == course.mention && <CourseBox key={course.code} {...course} />
        )}
      </Stack>
    );
  }
};
// console.log(course)
//(
//<CourseBox key={course.code} {...course} />
//)
