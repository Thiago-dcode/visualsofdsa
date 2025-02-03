import BaseService from "@/lib/classes/BaseService";

class DataStructureService extends BaseService {
  async getOneByLink(link: string) {
    return await this.client.dataStructure.findUnique({
      where: {
        link,
      },
    });
  }
  async getAllTypes() {
    return await this.client.dataStructureType.findMany({
      include: {
        children: {
          include: { type: true },
        },
      },
    });
  }
}

let singleton: DataStructureService | null = null;

export default (() => {
  if (!singleton) {
    singleton = new DataStructureService();
  }
  return singleton;
})();
