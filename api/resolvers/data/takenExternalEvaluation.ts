import { FieldResolver, Resolver, Root } from "type-graphql";

import { defaultStateCourse } from "../../../client/constants";
import { ExternalEvaluationDataLoader } from "../../dataloaders/externalEvaluation";
import { StudentExternalEvaluationDataLoader } from "../../dataloaders/takenExternalEvaluation";
import { TakenExternalEvaluation } from "../../entities/data/takenExternalEvaluation";
import { assertIsDefined } from "../../utils/assert";

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
  async topic(
    @Root()
    { id }: PartialTakenExternalEvaluation
  ): Promise<$PropertyType<TakenExternalEvaluation, "topic">> {
    assertIsDefined(
      id,
      `id needs to be available for Taken Course field resolvers`
    );
    const topicData = await StudentExternalEvaluationDataLoader.load(id);
    assertIsDefined(
      topicData,
      `Registration could not be found for ${id} taken course`
    );

    console.log(topicData);
    return topicData.topic;
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
}
