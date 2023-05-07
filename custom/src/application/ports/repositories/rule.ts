import { Rule } from "../../../domain/entities/rule";

export interface RuleRepository {
  create(input: Rule): Promise<void>;
  findById(id: string): Promise<Rule>;
}
