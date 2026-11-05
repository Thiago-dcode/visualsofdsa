import BaseService from "@/lib/classes/BaseService";

class AlgorithmService extends BaseService {
  async getOneByLink(link: string) {
    return await this.client.orm.public.Algorithm.where({ link }).first();
  }
  async getAllTypes() {
    return await this.client.orm.public.AlgorithmType.include("children", (children) =>
      children.include("type").orderBy((c) => c.order.asc()),
    ).all();
  }
  async getMetaDescription(link: string) {
    const algorithm = await this.client.orm.public.Algorithm.where({ link })
      .select("metaDescription")
      .first();
    return algorithm?.metaDescription ?? null;
  }
  async getAllTypesSimple() {
    return await this.client.orm.public.AlgorithmType.select("name", "enable", "link")
      .include("children", (children) =>
        children.select("name", "link", "enable").orderBy((c) => c.order.asc()),
      )
      .all();
  }
}

let singleton: AlgorithmService | null = null;

export default (() => {
  if (!singleton) {
    singleton = new AlgorithmService();
  }
  return singleton;
})();
