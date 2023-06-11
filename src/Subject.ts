export default class Subject
{
  public name: string;
  public id: number;
  public evaluation: number;

  setName(name: string): void
  {
    this.name = name;
  }

  setId(id: number): void
  {
    this.id = id;
  }

  setEvaluation(evaluation: number): void
  {
    this.evaluation = evaluation;
  }

  getName(): string
  {
    return this.name;
  }

  getId(): number
  {
    return this.id;
  }

  getEvaluation(): number
  {
    return this.evaluation;
  }
}
