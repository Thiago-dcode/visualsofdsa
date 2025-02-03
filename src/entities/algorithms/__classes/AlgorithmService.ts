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
