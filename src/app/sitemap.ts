import type { MetadataRoute } from 'next'
import AlgorithmService from '@/entities/algorithms/__classes/AlgorithmService'
import DataStructureService from '@/entities/data-structures/__classes/DataStructureService'
import { buildLinkFromArgs } from '@/lib/utils'
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL||''
  const [algorithms, dataStructures] = await Promise.all([AlgorithmService.getAllTypes(), DataStructureService.getAllTypes()])

  const algorithmsSitemap: MetadataRoute.Sitemap = algorithms.flatMap(algorithm => algorithm.children.map(child => ({
    url: buildLinkFromArgs(baseUrl,'algorithms', algorithm.link, child.link).substring(1),
    lastModified: '2025-04-19',
    changeFrequency: 'monthly',
    priority: 0.8,
  })))

  const dataStructuresSitemap: MetadataRoute.Sitemap = dataStructures.flatMap(dataStructure => dataStructure.children.map(child => ({
    url: buildLinkFromArgs(baseUrl,'data-structures', dataStructure.link, child.link).substring(1),
    lastModified: '2025-04-19',
    changeFrequency: 'monthly',
    priority: 0.6,
  })))

  return [
    {
      url: baseUrl,
      lastModified: '2025-04-19',
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: buildLinkFromArgs(baseUrl,'algorithms').substring(1),
      lastModified: '2025-04-19',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: buildLinkFromArgs(baseUrl,'data-structures').substring(1),
      lastModified: '2025-04-19',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...algorithmsSitemap,
    ...dataStructuresSitemap,
  ]
}