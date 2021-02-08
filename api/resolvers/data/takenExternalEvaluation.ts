import { compact, toInteger, toNumber } from "lodash";
import { FieldResolver, Resolver, Root } from "type-graphql";

import { defaultStateCourse } from "../../../client/constants";
import { ExternalEvaluationDataLoader } from "../../dataloaders/externalEvaluation";
import {
  ExternalEvaluationStatsByExternalEvaluationTakenDataLoader,
  ExternalEvaluationStatsByStateDataLoader,
  StudentExternalEvaluationDataLoader,
} from "../../dataloaders/takenExternalEvaluation";
import { TakenExternalEvaluation } from "../../entities/data/takenExternalEvaluation";
import { assertIsDefined } from "../../utils/assert";
import { clearErrorArray } from "../../utils/clearErrorArray";

import type { $PropertyType } from "utility-types";

export type PartialTakenExternalEvaluation = Pick<
  TakenExternalEvaluation,
  "id" | "code"
>;

@Resolver(() => TakenExternalEvaluation)
export class TakenExternalEvaluationResolver {
  @FieldResolver()
  async name(
    @Root()
    { code }: PartialTakenExternalEvaluation
  ): Promise<$PropertyType<TakenExternalEvaluation, "name">> {
    assertIsDefined(
      code,
      `code needs to be available for Taken Course field resolvers`
    );
    const nameData = await ExternalEvaluationDataLoader.load(code);

    if (nameData === undefined) {
      return code;
    }

    return nameData.name ?? nameData.id;
  }
  @FieldResolver()
  async registration(
    @Root()
    { id }: PartialTakenExternalEvaluation
  ): Promise<$PropertyType<TakenExternalEvaluation, "registration">> {
    assertIsDefined(
      id,
      `id needs to be available for Taken Course field resolvers`
    );
    const registrationData = await StudentExternalEvaluationDataLoader.load(id);
    assertIsDefined(
      registrationData,
      `Registration could not be found for ${id} taken course`
    );
    return registrationData.registration;
  }
  @FieldResolver()
  async grade(
    @Root()
    { id }: PartialTakenExternalEvaluation
  ): Promise<$PropertyType<TakenExternalEvaluation, "grade">> {
    assertIsDefined(
      id,
      `id and code needs to be available for Taken Course field resolvers`
    );
    const gradeData = await StudentExternalEvaluationDataLoader.load(id);
    assertIsDefined(
      gradeData,
      `Grade could not be found for ${id} taken course`
    );
    return gradeData.grade;
  }
  @FieldResolver()
  async state(
    @Root()
    { id }: PartialTakenExternalEvaluation
  ): Promise<$PropertyType<TakenExternalEvaluation, "state">> {
    assertIsDefined(
      id,
      `id needs to be available for Taken Course field resolvers`
    );
    const stateData = await StudentExternalEvaluationDataLoader.load(id);
    assertIsDefined(
      stateData,
      `State could not be found for ${id} taken course`
    );
    return defaultStateCourse(stateData.state);
  }
  @FieldResolver()
  async parallelGroup(
    @Root()
    { id }: PartialTakenExternalEvaluation
  ) {
    assertIsDefined(
      id,
      `id needs to be available for Taken Course field resolvers`
    );
    const parallelGroupData = await StudentExternalEvaluationDataLoader.load(
      id
    );
    assertIsDefined(
      parallelGroupData,
      `Parallel group could not be found for ${id} taken course`
    );
    return parallelGroupData.p_group;
  }
  @FieldResolver()
  async currentDistribution(
    @Root()
    { id, code }: PartialTakenExternalEvaluation
  ): Promise<$PropertyType<TakenExternalEvaluation, "currentDistribution">> {
    assertIsDefined(
      id,
      `id needs to be available for Taken Course field resolvers`
    );
    assertIsDefined(
      code,
      `code needs to be available for Taken Course field resolvers`
    );

    const dataTakenCourse = await StudentExternalEvaluationDataLoader.load(id);

    assertIsDefined(
      dataTakenCourse,
      `Data of the taken course ${id} ${code} could not be found!`
    );

    const histogramData = await ExternalEvaluationStatsByStateDataLoader.load({
      external_evaluation_taken: code,
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
    @Root() { code }: PartialTakenExternalEvaluation
  ): Promise<$PropertyType<TakenExternalEvaluation, "bandColors">> {
    const bandColorsData = compact(
      clearErrorArray(
        await ExternalEvaluationStatsByExternalEvaluationTakenDataLoader.loadMany(
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

    return bandColors as any;
  }
}
