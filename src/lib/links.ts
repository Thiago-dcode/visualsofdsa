import { LinkItem } from "../components/app/nav/type";
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
        link: "#",
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
        link: "#",
        children: [
          {
            name: 'Bubble',
            enable: true,
            children: null,
            link: '/algorithms/sort/bubble'
          },
          {
            name: 'Selection',
            enable: true,
            children: null,
            link: '/algorithms/sort/selection',
          },
          {
            name: 'Insertion',
            enable: true,
            children: null,
            link: '/algorithms/sort/insertion'
          },
          {
            name: 'Merge',
            enable: true,
            children: null,
            link: '/algorithms/sort/merge'
          },
          {
            name: 'Quick',
            enable: true,
            children: null,
            link: '/algorithms/sort/quick'
          }
        ],
        enable: true,
      },
    ],
  },
];
