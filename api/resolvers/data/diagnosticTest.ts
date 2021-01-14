import { toInteger, toNumber } from "lodash";
import { FieldResolver, Resolver, Root } from "type-graphql";

import {
  DiagnosticTestAndStructureDataLoader,
  DiagnosticTestStatsDataLoader,
} from "../../dataloaders/diagnosticTest";
import { DiagnosticTest } from "../../entities/data/diagnosticTest";

import type { $PropertyType } from "utility-types";

export type PartialDiagnosticTest = Pick<DiagnosticTest, "id" | "code">;

/**
 * These resolvers assumes that they will always have access to:
 * "id" which comes from program_structure => id
 * "code" which comes from program_structure => code
 */
@Resolver(() => DiagnosticTest)
export class DiagnosticTestResolver {
  @FieldResolver()
  async name(
    @Root()
    { id, code }: PartialDiagnosticTest
  ): Promise<$PropertyType<DiagnosticTest, "name">> {
    return (
      (await DiagnosticTestAndStructureDataLoader.load({ id, code }))
        ?.diagnosticTestTable?.name ?? ""
    );
  }

  @FieldResolver()
  async mention(
    @Root() { id, code }: PartialDiagnosticTest
  ): Promise<$PropertyType<DiagnosticTest, "mention">> {
    return (
      (
        await DiagnosticTestAndStructureDataLoader.load({
          id,
          code,
        })
      )?.programStructureTable?.mention ?? ""
    );
  }

  @FieldResolver()
  async historicalDistribution(
    @Root() { code }: PartialDiagnosticTest
  ): Promise<$PropertyType<DiagnosticTest, "historicalDistribution">> {
    const histogramData = await DiagnosticTestStatsDataLoader.load(code);

    const reducedHistogramData =
      histogramData?.reduce<Record<number, { label: string; value: number }>>(
        (acum, { histogram, histogram_labels }, key) => {
          const histogramValues = histogram.split(",").map(toInteger);
          const histogramLabels = key === 0 ? histogram_labels.split(",") : [];

          for (let i = 0; i < histogramValues.length; i++) {
            acum[i] = {
              label: acum[i]?.label ?? histogramLabels[i],
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
    @Root() { code }: PartialDiagnosticTest
  ): Promise<$PropertyType<DiagnosticTest, "bandColors">> {
    const bandColorsData = (
      await DiagnosticTestStatsDataLoader.load(code)
    )?.[0];

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
