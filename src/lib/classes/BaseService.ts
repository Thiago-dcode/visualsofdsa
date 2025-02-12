import { EntityBase, EntityType, EntityTypeSimple } from "@/types";
import { prisma } from "../prisma";
export default abstract class BaseService {
  protected client = prisma;

  abstract getOneByLink(link: string): Promise<EntityBase | null>;

  abstract getAllTypes(): Promise<EntityType[]>;
  abstract getAllTypesSimple(): Promise<EntityTypeSimple[]>;
}
