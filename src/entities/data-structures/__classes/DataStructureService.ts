import BaseService from "@/lib/classes/BaseService";

class DataStructureService extends BaseService {
  async getOneByLink(link: string) {
    return await this.client.orm.public.DataStructure.where({ link }).first();
  }
  async getMetaDescription(link: string) {
    const dataStructure = await this.client.orm.public.DataStructure
      .where({ link })
      .select('metaDescription')
      .first();
    return dataStructure?.metaDescription ?? null;
  }
  async getAllTypes() {
    return await this.client.orm.public.DataStructureType
      .include('children', (children) => children.include('type'))
      .all();
  }
  async getAllTypesSimple() {
    return await this.client.orm.public.DataStructureType
      .select('name', 'enable', 'link')
      .include('children', (children) => children.select('name', 'link', 'enable'))
      .all();
  }
}

let singleton: DataStructureService | null = null;

export default (() => {
  if (!singleton) {
    singleton = new DataStructureService();
  }
  return singleton;
})();
