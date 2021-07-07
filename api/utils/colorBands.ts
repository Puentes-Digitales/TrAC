import { assertIsDefined } from "../utils/assert";
import { toNumber } from "lodash";

export function getColorBands(color_bands: string) {
  return color_bands.split(";").map((value) => {
    const [min, max, color] = value.split(",");
    assertIsDefined(min, `Undefined color band minimum value`);
    assertIsDefined(max, `Undefined color band maximum value`);
    assertIsDefined(color, `Undefined color for band value`);
    return {
      min: toNumber(min),
      max: toNumber(max),
      color: color,
    };
  });
}
