import { RuleRepository } from "../../application/ports/repositories/rule";
import { Rule } from "../../domain/entities/rule";

export class InMemoryRuleRepository implements RuleRepository {
  private strategies: Rule[] = [];

  async create(input: Rule): Promise<void> {
    this.strategies.push(input);
  }

  async findById(id: string): Promise<Rule> {
    return this.strategies.find((strategy) => strategy.id === id);
  }
}
