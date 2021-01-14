import { compact, toInteger, toNumber } from "lodash";
import { FieldResolver, Resolver, Root } from "type-graphql";

import { defaultStateCourse } from "../../../client/constants";
import { DiagnosticTestDataLoader } from "../../dataloaders/diagnosticTest";
import {
  DiagnosticTestStatsByDiagnosticTestTakenDataLoader,
  DiagnosticStatsByStateDataLoader,
  StudentDiagnosticTestDataLoader,
} from "../../dataloaders/takenDiagnosticTest";
import { TakenDiagnosticTest } from "../../entities/data/takenDiagnosticTest";
import { assertIsDefined } from "../../utils/assert";
import { clearErrorArray } from "../../utils/clearErrorArray";

import type { $PropertyType } from "utility-types";

export type PartialTakenDiagnosticTest = Pick<
  TakenDiagnosticTest,
  "id" | "code"
>;

@Resolver(() => TakenDiagnosticTest)
export class TakenDiagnosticTestResolver {
  @FieldResolver()
  async name(
    @Root()
    { code }: PartialTakenDiagnosticTest
  ): Promise<$PropertyType<TakenDiagnosticTest, "name">> {
    assertIsDefined(
      code,
      `code needs to be available for Taken Course field resolvers`
    );
    const nameData = await DiagnosticTestDataLoader.load(code);

    if (nameData === undefined) {
      return code;
    }

    return nameData.name ?? nameData.id;
  }
  @FieldResolver()
  async registration(
    @Root()
    { id }: PartialTakenDiagnosticTest
  ): Promise<$PropertyType<TakenDiagnosticTest, "registration">> {
    assertIsDefined(
      id,
      `id needs to be available for Taken Course field resolvers`
    );
    const registrationData = await StudentDiagnosticTestDataLoader.load(id);
    assertIsDefined(
      registrationData,
      `Registration could not be found for ${id} taken course`
    );
    return registrationData.registration;
  }
  @FieldResolver()
  async grade(
    @Root()
    { id }: PartialTakenDiagnosticTest
  ): Promise<$PropertyType<TakenDiagnosticTest, "grade">> {
    assertIsDefined(
      id,
      `id and code needs to be available for Taken Course field resolvers`
    );
    const gradeData = await StudentDiagnosticTestDataLoader.load(id);
    assertIsDefined(
      gradeData,
      `Grade could not be found for ${id} taken course`
    );
    return gradeData.grade;
  }
  @FieldResolver()
  async state(
    @Root()
    { id }: PartialTakenDiagnosticTest
  ): Promise<$PropertyType<TakenDiagnosticTest, "state">> {
    assertIsDefined(
      id,
      `id needs to be available for Taken Course field resolvers`
    );
    const stateData = await StudentDiagnosticTestDataLoader.load(id);
    assertIsDefined(
      stateData,
      `State could not be found for ${id} taken course`
    );
    return defaultStateCourse(stateData.state);
  }
  @FieldResolver()
  async parallelGroup(
    @Root()
    { id }: PartialTakenDiagnosticTest
  ) {
    assertIsDefined(
      id,
      `id needs to be available for Taken Course field resolvers`
    );
    const parallelGroupData = await StudentDiagnosticTestDataLoader.load(id);
    assertIsDefined(
      parallelGroupData,
      `Parallel group could not be found for ${id} taken course`
    );
    return parallelGroupData.p_group;
  }
  @FieldResolver()
  async currentDistribution(
    @Root()
    { id, code }: PartialTakenDiagnosticTest
  ): Promise<$PropertyType<TakenDiagnosticTest, "currentDistribution">> {
    assertIsDefined(
      id,
      `id needs to be available for Taken Course field resolvers`
    );
    assertIsDefined(
      code,
      `code needs to be available for Taken Course field resolvers`
    );

    const dataTakenCourse = await StudentDiagnosticTestDataLoader.load(id);

    assertIsDefined(
      dataTakenCourse,
      `Data of the taken course ${id} ${code} could not be found!`
    );

    const histogramData = await DiagnosticStatsByStateDataLoader.load({
      diagnostic_test_taken: code,
      year: dataTakenCourse.year,
      term: dataTakenCourse.term,
      p_group: dataTakenCourse.p_group,
    });

    if (histogramData === undefined) {
      return [];
    }

    assertIsDefined(
      histogramData,
      `Stats Data of the taken course ${id} ${code} could not be found!`
    );

    const histogramValues = histogramData.histogram.split(",").map(toInteger);
    const histogramLabels = histogramData.histogram_labels.split(",");

    return histogramValues.map((value, key) => {
      return {
        label: histogramLabels[key] ?? `${key}`,
        value,
      };
    });
  }

  @FieldResolver()
  async bandColors(
    @Root() { code }: PartialTakenDiagnosticTest
  ): Promise<$PropertyType<TakenDiagnosticTest, "bandColors">> {
    const bandColorsData = compact(
      clearErrorArray(
        await DiagnosticTestStatsByDiagnosticTestTakenDataLoader.loadMany(
          compact([code])
        )
      )
    )[0];

    if (bandColorsData === undefined) {
      return [];
    }

    const bandColors = bandColorsData.color_bands.split(";").map((value) => {
      const [min, max, color] = value.split(",");
      return {
        min: toNumber(min),
        max: toNumber(max),
        color,
      };
    });

    return bandColors;
  }
}
