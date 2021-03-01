import { toInteger, toNumber } from "lodash";
import { FieldResolver, Resolver, Root } from "type-graphql";

import {
  ExternalEvaluationStructureDataLoader,
  ExternalEvaluationStatsDataLoader,
} from "../../dataloaders/externalEvaluation";
import { ExternalEvaluation } from "../../entities/data/externalEvaluation";

import type { $PropertyType } from "utility-types";

export type PartialExternalEvaluation = Pick<ExternalEvaluation, "id" | "code">;

/**
 * These resolvers assumes that they will always have access to:
 * "id" which comes from program_structure => id
 * "code" which comes from program_structure => code
 */
@Resolver(() => ExternalEvaluation)
export class ExternalEvaluationResolver {
  @FieldResolver()
  async name(
    @Root()
    { id, code }: PartialExternalEvaluation
  ): Promise<$PropertyType<ExternalEvaluation, "name">> {
    return (
      (await ExternalEvaluationStructureDataLoader.load({ id, code }))
        ?.externalEvaluationTable?.name ?? ""
    );
  }

  @FieldResolver()
  async mention(
    @Root() { id, code }: PartialExternalEvaluation
  ): Promise<$PropertyType<ExternalEvaluation, "mention">> {
    return (
      (
        await ExternalEvaluationStructureDataLoader.load({
          id,
          code,
        })
      )?.externalEvaluationtructureTable?.mention ?? ""
    );
  }

  @FieldResolver()
  async historicalDistribution(
    @Root() { code }: PartialExternalEvaluation
  ): Promise<$PropertyType<ExternalEvaluation, "historicalDistribution">> {
    const histogramData = await ExternalEvaluationStatsDataLoader.load(code);

    const reducedHistogramData =
      histogramData?.reduce<Record<number, { label: string; value: number }>>(
        (acum, { histogram, histogram_labels }, key) => {
          const histogramValues = histogram.split(",").map(toInteger);
          const histogramLabels = key === 0 ? histogram_labels.split(",") : [];

          for (let i = 0; i < histogramValues.length; i++) {
            acum[i] = {
              label: acum[i]?.label ?? histogramLabels[i] ?? "",
              value: (acum[i]?.value ?? 0) + (histogramValues[i] ?? 0),
            };
          }
          return acum;
        },
        {}
      ) ?? {};

    return Object.values(reducedHistogramData);
  }

  @FieldResolver()
  async bandColors(
    @Root() { code }: PartialExternalEvaluation
  ): Promise<$PropertyType<ExternalEvaluation, "bandColors">> {
    const bandColorsData = (
      await ExternalEvaluationStatsDataLoader.load(code)
    )?.[0];

    if (bandColorsData === undefined) {
      return [];
    }

    const bandColors = bandColorsData.color_bands.split(";").map((value) => {
      const [min, max, color] = value.split(",");
      return {
        min: toNumber(min),
        max: toNumber(max),
        color: color ?? "",
      };
    });

    return bandColors;
  }
}
