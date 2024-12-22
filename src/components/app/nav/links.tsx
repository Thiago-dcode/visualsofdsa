import { LinkItem } from "./type";
export const LINKS: LinkItem[] = [
  {
    name: "Data structures",
    link: "/data-structures",
    image: {
      dark: 'dsimagedark.png',
      light: 'dsimagelight.png'
    },
    description: <>
      <p> <b>A data structure is a way of organizing and storing data in a computer</b> to enable efficient access and use. It encompasses both the logical or mathematical representation of data and its implementation in a computer program. </p>

      <p > Think of it like organizing your belongings in your room—clothes, computer, books, and so on. You could put everything in one spot, like under your bed (very inefficient), but every time you need something, you’d have to dig through the pile.  The more organized your room is, the faster and easier it is to find what you need. Having an efficient <b className="text-app-bauhaus-yellow"> data structure is like having a well-organized room, providing ease, clarity, and a sense of relief that everything is in its place.</b> </p>
    </>,
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
        description: 'Non-linear data structures are those where data items are not arranged in a sequential manner, unlike linear data structures. In these data structures, elements are stored in a hierarchical or a network-based structure that does not follow a sequential order.',
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
    image: {
      dark: 'algoimagedark.png',
      light: 'algoimagelight.png'
    },
    description: <>
      Algorithm is a step-by-step procedure for solving a problem or accomplishing a task. In the context of data structures and algorithms, <b>it is a set of well-defined instructions for performing a specific computational task.</b> Algorithms are fundamental to computer science and play a very important role in designing efficient solutions for various problems. Understanding algorithms is essential for anyone interested in mastering data structures and algorithms.
    </>,
    enable: true,
    children: [
      {
        name: "Search",
        link: "#",
        description: <>
          Searching algorithms are used to locate specific items within a collection of data. These algorithms are designed to efficiently navigate through data structures to find the desired information, making them fundamental in various applications such as databases, web search engines, and more.
        </>,
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
            enable: false,
            children: null,
            link: '/algorithms/sort/quick'
          }
        ],
        enable: true,
      },
    ],
  },
];
