import BaseService from "@/lib/classes/BaseService";
class AlgorithmService extends BaseService {
  async getOneByLink(link: string) {
    return await this.client.algorithm.findUnique({
      where: {
        link,
      },
    });
  }
  async getAllTypes() {
    return await this.client.algorithmType.findMany({
      include: {
        children: {
          include: { type: true },
          orderBy: {
            order: 'asc',
          },
        },
      },

    });
  }
  async getMetaDescription(link: string) {
    const algorithm = await this.client.algorithm.findUnique({
      where: { link },
      select: { metaDescription: true },
    });
    return algorithm?.metaDescription ?? null;
  }
  async getAllTypesSimple() {
    return await this.client.algorithmType.findMany({
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
          orderBy: {
            order: 'asc',
          },
        },

      },

    });
  }
}

let singleton: AlgorithmService | null = null;

export default (() => {
  if (!singleton) {
    singleton = new AlgorithmService();
  }
  return singleton;
})();
