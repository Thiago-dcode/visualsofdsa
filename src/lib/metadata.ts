import { Metadata } from "next/types"

export const appMetadata = ({ title, description, ...rest }: Metadata): Metadata => {

  return {
    title: `${title} | Visualsofdsa`,
    applicationName: 'Visualsofdsa',
    keywords: [
      "interactive data structures visualizer",
      "algorithm animation tutorials",
      "binary tree simulation tool",
      "graph algorithms visualization",
      "coding interview prep platform",
      "real-time sorting algorithm demo",
      "DSA visual learning platform",
      "dynamic programming animations",
      "computer science visualization tool",
      "step-by-step algorithm visualizer"
    ],
    description: description || 'Master computer science concepts through interactive data structures and algorithm animations. Explore binary trees, graph traversals, and sorting methods with real-time visualizations. Ideal for coding interview prep and CS education.',

    ...rest,

  }
}

