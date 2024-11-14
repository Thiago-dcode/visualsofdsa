import { LinkItem } from "./type";

export const LINKS: LinkItem[] = [
  {
    name: "Data structures",
    link: "/data-structures",
    enable: true,
    children: [
      {
        name: "linear",
        link: "#",
        enable: true,
        description:
          "Linear Data Structures are a type of data structure in computer science where data elements are arranged sequentially or linearly. Each element has a previous and next adjacent, except for the first and last elements.",
        children: [
          {
            name: "Stack",
            link: "/data-structures/linear/stack",
            children: null,
            enable: true,
          },
          {
            name: "Queue",
            link: "/data-structures/linear/queue",
            children: null,
            enable: true,
          },
          {
            name: "Static array",
            link: "/data-structures/linear/static-array",
            children: null,
            enable: true,
          },
          {
            name: "Dynamic array",
            link: "/data-structures/linear/dynamic-array",
            children: null,
            enable: true,
          },
          {
            name: "Linked list",
            link: "/data-structures/linear/linked-list",
            children: null,
            enable: true,
          },
          {
            name: "Doubly linked list",
            link: "/data-structures/linear/doubly-linked-list",
            children: null,
            enable: true,
          },
        ],
      },
      {
        name: "Non linear",
        link: "#",
        description:'Non-linear data structures are those where data items are not arranged in a sequential manner, unlike linear data structures. In these data structures, elements are stored in a hierarchical or a network-based structure that does not follow a sequential order.',
        enable: false,
        children: [
          {
            name: "Graph",
            link: "/data-structures/non-linear/graph",
            children: null,
            enable: false,
          },
          {
            name: "Tree",
            link: "/data-structures/non-linear/tree",
            children: null,
            enable: false,
          },
          {
            name: "Binary tree search",
            link: "/data-structures/non-linear/bts",
            children: null,
            enable: false,
          },
        ],
      },
    ],
  },
  {
    name: "Algorithms",
    link: "/algorithms",
    enable: true,
    children: [
      {
        name: "Search",
        link: "/algorithms/search",
        enable: true,
        children: [
          {
            name: "Linear",
            enable: true,
            children: null,
            link: "/algorithms/search/linear",
          },
          {
            name: "Binary",
            enable: true,
            children: null,
            link: "/algorithms/search/binary",
          },
        ],
      },
      {
        name: "Sort",
        link: "/algorithms/sort",
        children: null,
        enable: false,
      },
    ],
  },
];
