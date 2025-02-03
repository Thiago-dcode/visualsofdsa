import { EntityBase, EntityType } from "@/types";
import { PrismaClient } from "@prisma/client";
export default abstract class BaseService {
  protected client = new PrismaClient();

  abstract getOneByLink(link: string): Promise<EntityBase | null>;

  abstract getAllTypes(): Promise<EntityType[]>;
}
