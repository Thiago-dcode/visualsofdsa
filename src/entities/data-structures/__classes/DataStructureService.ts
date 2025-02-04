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
  async getAllTypesSimple() {
    return await this.client.dataStructureType.findMany({
      select: {
        name: true,
        enable: true,
        link: true,
        children: {
          select: {
            name: true,
            link: true,
            enable: true,
          },
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
