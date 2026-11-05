import { EntityBase, EntityType, EntityTypeSimple } from "@/types";
import { db } from "../prisma";
export default abstract class BaseService {
  protected client = db;

  abstract getOneByLink(link: string): Promise<EntityBase | null>;
  abstract getAllTypes(): Promise<EntityType[]>;
  abstract getAllTypesSimple(): Promise<EntityTypeSimple[]>;
  abstract getMetaDescription(link: string): Promise<string | null>;
}
