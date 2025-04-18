import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { buildDescription, BigOType } from "./utils";

const dataStructureTypes: Prisma.DataStructureTypeCreateInput[] = [
  {
    name: "linear",
    description:
      "Linear Data Structures organize elements sequentially with direct predecessor-successor relationships, enabling efficient O(1) ACCESS patterns. Ideal for memory-efficient storage and real-world applications like queue operations, stack management, and array implementations. Common examples are linked lists where elements follow strict insertion order.",
    enable: true,
    link: "linear",
  },
  {
    name: "non linear",
    description:
      "Non-linear data structures manage complex hierarchical relationships through multi-dimensional connections, essential for graph algorithms and tree traversal systems. These network-based organizations enable efficient representation of social networks, file systems, and neural networks through structures like binary search trees and adjacency matrices, optimizing pathfinding and parent-child node operations.",
    enable: true,
    link: "non-linear",
  }
];

const algorithmsTypes: Prisma.AlgorithmTypeCreateInput[] = [
  {
    name: "search",
    description:
      "Search algorithms are methods used to find specific items within a data structure, such as an array, list, or tree. They are fundamental in computer science and are used in a wide range of applications, from databases to artificial intelligence.",
    enable: true,
    link: "search",
  },
  {
    name: "sort",
    description:
      "Sorting algorithms are methods used to arrange elements in a specific order (e.g., ascending or descending). They are essential for organizing data, improving search efficiency, and solving problems like finding duplicates or computing statistics.",
    enable: true,
    link: "sort",
  },
];
(async () => {
  await prisma.dataStructureType.deleteMany({});
  await prisma.dataStructure.deleteMany({});

  for (const type of dataStructureTypes) {
    const result = await prisma.dataStructureType.create({ data: type });

    switch (result.name) {
      case "linear":
        await prisma.dataStructure.createMany({
          data: [
            {
              name: "stack",
              link: "stack",
              enable: true,
              dataStructureTypeId: result.id,
              description: buildDescription({
                description: 'A <b>Stack</b> is a fundamental <b>linear data structure</b> that operates on the <b>Last In, First Out (LIFO)</b> principle, making it an essential tool in computer science and software development. This powerful data structure is widely used in various applications, from managing function calls in programming languages to implementing undo/redo features in software applications.',
                coreCharacteristics: [
                  'Follows the <b>LIFO</b> principle - Last element added is the first to be removed',
                  'Maintains a single point of access (the top of the stack)',
                  'Provides constant-time operations for basic functions',
                  'Ideal for managing nested operations and recursive algorithms'
                ],
                keyOperations: [
                  {
                    operation: 'Push',
                    color: 'green',
                    description: '<b>adds a new element to the top of the stack</b>. The newly added element becomes the new top, while the previous top element moves down one position. This operation is crucial for building the stack and maintaining its LIFO property',
                    bigO: '1' 
                  },
                  {
                    operation: 'Pop',
                    color: 'red',
                    description: '<b>removes and returns the top element of the stack</b>. Following the LIFO principle, it always removes the most recently added element. This operation is essential for processing elements in reverse order of their addition',
                    bigO: '1'
                  },
                  {
                    operation: 'Peek',
                    color: 'yellow',
                    description: '<b>inspects the top element without removing it</b>. It\'s particularly useful for checking the current state of the stack without modifying its contents, making it ideal for conditional operations and stack state validation',
                    bigO: '1'
                  }
                ],
                commonApplications: [
                  'Function call management in programming languages',
                  'Expression evaluation and syntax parsing',
                  'Undo/redo operations in software applications',
                  'Browser history management',
                  'Memory management in operating systems'
                ]
              }),
            },
            {
              name: "queue",
              link: "queue",
              description: buildDescription({
                description: 'A <b>Queue</b> is a fundamental <b>linear data structure</b> that operates on the <b>First In, First Out (FIFO)</b> principle, making it an essential tool for managing ordered processes in computer science. This versatile data structure is widely used in various applications, from task scheduling in operating systems to handling requests in web servers.',
                coreCharacteristics: [
                  'Follows the <b>FIFO</b> principle - First element added is the first to be removed',
                  'Maintains two points of access (front and rear)',
                  'Provides constant-time operations for basic functions',
                  'Ideal for managing ordered processes and task scheduling'
                ],
                keyOperations: [
                  {
                    operation: 'Enqueue',
                    color: 'green',
                    description: '<b>adds a new element to the rear of the queue</b>. The newly added element becomes the new rear, while maintaining the order of previously added elements. This operation is crucial for building the queue and maintaining its FIFO property',
                    bigO: '1'
                  },
                  {
                    operation: 'Dequeue',
                    color: 'red',
                    description: '<b>removes and returns the front element of the queue</b>. Following the FIFO principle, it always removes the oldest element in the queue. This operation is essential for processing elements in the order they were added',
                    bigO: '1'
                  },
                  {
                    operation: 'Front',
                    color: 'yellow',
                    description: '<b>inspects the front element without removing it</b>. It\'s particularly useful for checking the next element to be processed without modifying the queue\'s contents, making it ideal for queue state validation and conditional operations',
                    bigO: '1'
                  }
                ],
                commonApplications: [
                  'Task scheduling in operating systems',
                  'Request handling in web servers',
                  'Breadth-first search (BFS) in graph algorithms',
                  'Print job management',
                  'Message queuing systems'
                ]
              }),
              enable: true,
              dataStructureTypeId: result.id,
            },
            {
              name: "static array",
              link: "static-array",
              description: buildDescription({
                description: 'A <b>Static Array</b> is a fundamental <b>linear data structure</b> that stores elements in <b>contiguous memory locations</b> with a <b>fixed size</b> determined at compile time. This efficient data structure is widely used in various applications, from implementing lookup tables to storing collections of items with known sizes.',
                coreCharacteristics: [
                  'Fixed size determined at compile time and cannot be changed at runtime',
                  'Elements stored in contiguous memory locations',
                  'Provides constant-time access to any element using indexing',
                  'Memory-efficient for known-size collections'
                ],
                keyOperations: [
                  {
                    operation: 'Access',
                    color: 'yellow',
                    description: '<b>retrieves an element at a specified index</b>. Arrays provide direct access to any element via its index, making this operation extremely efficient regardless of array size',
                    bigO: '1'
                  },
                  {
                    operation: 'Write',
                    color: 'green',
                    description: '<b>sets the value of an element at a specified index</b>. Since the array size is fixed, writing to an existing position is straightforward and efficient, requiring only a single memory operation',
                    bigO: '1'
                  },
                  {
                    operation: 'Search',
                    color: 'blue',
                    description: '<b>finds the position of a specific value</b> in the array. Since arrays don\'t maintain any particular order by default, searching requires checking each element sequentially from the beginning',
                    bigO: 'n'
                  }
                ],
                commonApplications: [
                  'Lookup tables and constant data storage',
                  'Matrix and multi-dimensional data representation',
                  'Implementation of other data structures like stacks and queues',
                  'Buffer implementations with fixed sizes',
                  'Storing and processing sequential data with known boundaries'
                ]
              }),
              enable: true,
              dataStructureTypeId: result.id,
            },
            {
              name: "Dynamic Array",
              link: "dynamic-array",
              description: buildDescription({
                description: 'A <b>Dynamic Array</b> is a versatile <b>linear data structure</b> similar to static arrays, but it can dynamically resize itself to accommodate more elements. This flexibility makes dynamic arrays ideal for applications where the number of elements is not known in advance.',
                coreCharacteristics: [
                  'Can dynamically resize to accommodate more elements',
                  'Elements stored in contiguous memory locations',
                  'Provides constant-time access to any element using indexing',
                  'Efficient for scenarios where the number of elements changes frequently'
                ],
                keyOperations: [
                  {
                    operation: 'Push',
                    color: 'green',
                    description: '<b>adds a new element to the end of the array</b>. If the array is full, it resizes by allocating a new array with double the capacity and copying existing elements',
                    bigO: '1'
                  },
                  {
                    operation: 'Pop',
                    color: 'red',
                    description: '<b>removes the last element of the array</b>. This operation is straightforward and efficient, requiring only a single memory operation',
                    bigO: '1'
                  },
                  {
                    operation: 'Insert',
                    color: 'orange',
                    description: '<b>adds an element at a specific position by a given index</b>. To accomplish this, elements on the right side of the desired position must be shifted to the right before the new element is inserted',
                    bigO: 'n'
                  },
                  {
                    operation: 'Delete',
                    color: 'red',
                    description: '<b>removes an element from a specific position by a given index</b>. This requires shifting elements on the right side to the left to fill the gap',
                    bigO: 'n'
                  }
                ],
                commonApplications: [
                  'Dynamic data storage where size is not fixed',
                  'Implementation of data structures like stacks and queues',
                  'Buffer implementations that require resizing',
                  'Handling collections of items with varying sizes',
                  'Efficiently managing lists in applications with frequent insertions and deletions'
                ]
              }),
              enable: true,
              dataStructureTypeId: result.id,
            },
            {
              name: "Linked List",
              link: "linked-list",
              description: buildDescription({
                description: 'A <b>Linked List</b> is a fundamental <b>linear data structure</b> consisting of nodes, where each node contains a value and a pointer (or reference) to the <b>next</b> node in the sequence. Unlike arrays, linked lists do not require contiguous memory locations, making them more flexible for dynamic memory allocation. They are particularly useful when frequent insertions and deletions are required, especially at the head or tail.',
                coreCharacteristics: [
                  'Nodes are connected via pointers, allowing dynamic memory allocation',
                  'Does not require contiguous memory locations',
                  'Efficient for frequent insertions and deletions',
                  'Ideal for implementing dynamic data structures'
                ],
                keyOperations: [
                  {
                    operation: 'Add',
                    color: 'green',
                    description: '<b>adds a new node to the linked list</b>. The new node can be inserted at the head, tail, or a specific position. The pointer of the previous node needs to be updated to maintain the structure. If is add at the head, the time complexity is O(1).',
                    bigO: 'n'
                  },
                  {
                    operation: 'Delete',
                    color: 'red',
                    description: '<b>removes a node from the linked list</b>. The node to be deleted could be anywhere in the list, and the pointer of the previous node must be adjusted to skip over the deleted node. If is delete at the head, the time complexity is O(1).',
                    bigO: 'n'
                  },
                  {
                    operation: 'Get',
                    color: 'yellow',
                    description: '<b>finds and returns the first node that contains the desired value</b>. The list must be traversed from the head until the value is found or the end is reached. If is get at the head, the time complexity is O(1).',
                    bigO: 'n'
                  }
                ],
                commonApplications: [
                  'Dynamic memory allocation and management',
                  'Implementation of stacks and queues',
                  'Efficient insertion and deletion operations',
                  'Used in applications requiring frequent updates to data structures',
                  'Ideal for implementing complex data structures like graphs and trees'
                ]
              }),
              enable: true,
              dataStructureTypeId: result.id,
            },
            {
              name: "Doubly Linked List",
              link: "doubly-linked-list",
              description: buildDescription({
                description: 'A <b>Doubly Linked List</b> is a versatile <b>linear data structure</b> consisting of nodes, where each node contains a value and two pointers (or references): one pointing to the <b>next</b> node and another pointing to the <b>previous</b> node in the sequence. This bidirectional navigation allows more efficient operations, especially for traversal in both directions. Doubly linked lists are particularly useful when frequent insertions and deletions are required at both ends of the list.',
                coreCharacteristics: [
                  'Nodes contain pointers to both the next and previous nodes, enabling bidirectional traversal',
                  'Does not require contiguous memory locations',
                  'Efficient for frequent insertions and deletions at both ends',
                  'Ideal for implementing complex data structures'
                ],
                keyOperations:  [
                  {
                    operation: 'Add',
                    color: 'green',
                    description: '<b>adds a new node to the doubly linked list</b>. The new node can be inserted at the head, tail, or a specific position. The previous and next pointers need to be updated to maintain the structure. If added at the head or tail, the time complexity is O(1).',
                    bigO: 'n'
                  },
                  {
                    operation: 'Delete',
                    color: 'red',
                    description: '<b>removes a node from the doubly linked list</b>. The node to be deleted could be anywhere in the list, and both the previous and next pointers of neighboring nodes need to be adjusted. If deleted at the head or tail, the time complexity is O(1).',
                    bigO: 'n'
                  },
                  {
                    operation: 'Get',
                    color: 'yellow',
                    description: '<b>finds and returns the first node that contains the desired value</b>. Since a doubly linked list can be traversed from both the head and the tail, searching can be done in either direction. If the node is at the head or tail, the time complexity is O(1).',
                    bigO: 'n'
                  }
                ],
                commonApplications: [
                  'Bidirectional traversal and efficient memory management',
                  'Implementation of complex data structures like deques and caches',
                  'Efficient insertion and deletion operations at both ends',
                  'Used in applications requiring frequent updates to data structures',
                  'Ideal for implementing undo/redo functionality in applications'
                ]
              }),
              enable: true,
              dataStructureTypeId: result.id,
            },
          ],
        });
        break;
      case "non linear":
        await prisma.dataStructure.createMany({
          data: [
            {
              name: "binary search tree",
              link: "binary-search-tree",
              description: buildDescription({
                description: 'A <b>Binary Search Tree (BST)</b> is a specialized <b>hierarchical data structure</b> where each node has at most two children, referred to as the <b>left child</b> and the <b>right child</b>. In a BST, the value of each node is greater than all values in its left subtree and less than all values in its right subtree. This property makes BSTs highly efficient for search, insertion, and deletion operations.',
                coreCharacteristics: [
                  'Each node has at most two children: left and right',
                  'Values in the left subtree are less than the node\'s value',
                  'Values in the right subtree are greater than the node\'s value',
                  'Efficient for search, insertion, and deletion operations'
                ],
                keyOperations: [
                  {
                    operation: 'Insert',
                    color: 'green',
                    description: '<b>adds a new node to the binary search tree</b>. The node is placed in the correct position based on its value, ensuring the BST property is maintained',
                    bigO: 'log n'
                  },
                  {
                    operation: 'Delete',
                    color: 'red',
                    description: '<b>removes a node from the binary search tree</b>. There are three cases: deleting a leaf node, deleting a node with one child, and deleting a node with two children. The BST property must be preserved after deletion',
                    bigO: 'log n'
                  },
                  {
                    operation: 'Search',
                    color: 'blue',
                    description: '<b>finds a node with a specific value in the binary search tree</b>. It starts at the root and recursively compares the target value with the current node, moving left or right based on the comparison',
                    bigO: 'log n'
                  },
                  {
                    operation: 'In-order Traversal',
                    color: 'orange',
                    description: '<b>visits all nodes in the binary search tree</b> in in-order sequence: left, root, right. This traversal method is commonly used to retrieve the nodes of a BST in non-decreasing order.',
                    bigO: 'n'
                  },
                  {
                    operation: 'Pre-order Traversal',
                    color: 'orange',
                    description: '<b>visits all nodes in the binary search tree</b> in pre-order sequence: root, left, right. This traversal method is useful for creating a copy of the tree.',
                    bigO: 'n'
                  },
                  {
                    operation: 'Post-order Traversal',
                    color: 'orange',
                    description: '<b>visits all nodes in the binary search tree</b> in post-order sequence: left, right, root. This traversal method is often used to delete the tree.',
                    bigO: 'n'
                  },
                  {
                    operation: 'Level-order Traversal',
                    color: 'orange',
                    description: '<b>visits all nodes in the binary search tree</b> in level-order sequence: root, left, right. This traversal method is often used to create a level-order traversal of the tree.',
                    bigO: 'n'
                  }
                ],
                commonApplications: [
                  'Efficient searching, insertion, and deletion operations',
                  'Used in applications requiring dynamic data storage',
                  'Ideal for implementing associative arrays and priority queues',
                  'Commonly used in database indexing and memory management'
                ]
              }),
              enable: true,
              dataStructureTypeId: result.id,
            },
          ],
        });
        break;
      default:
        break;
    }
  }
  await prisma.algorithmType.deleteMany({});
  await prisma.algorithm.deleteMany({});
  for (const type of algorithmsTypes) {
    const result = await prisma.algorithmType.create({ data: type });

    switch (result.name) {
      case "search":
        await prisma.algorithm.createMany({
          data: [
            {
              name: "linear",
              link: "linear",
              enable: true,
              algorithmTypeId: result.id,
              description: buildDescription({
                description: 'Linear search, also known as sequential search, is a straightforward method for finding an element within a data structure, such as an array or list. It involves checking each element sequentially until a match is found or the entire structure has been searched.',
                coreCharacteristics: [
                  'Simple and intuitive search method',
                  'Does not require the data structure to be sorted',
                  'Inefficient for large datasets due to its linear time complexity'
                ],
                keyOperations: [
                  {
                    operation: 'Search',
                    color: 'blue',
                    description: '<b>sequentially checks each element</b> in the data structure until the target element is found or the end is reached. This operation is straightforward but can be time-consuming for large datasets.',
                    bigO: 'n'
                  }
                ],
                commonApplications: [
                  'Searching in small or unsorted datasets',
                  'Used in scenarios where simplicity is preferred over efficiency',
                  'Applicable in educational contexts to demonstrate basic search principles'
                ]
              }),
            },
            {
              name: "binary",
              link: "binary",
              description: buildDescription({
                description: 'Binary search is an efficient algorithm for finding an element within a <b>sorted array</b>. It works by repeatedly dividing the search interval in half, significantly reducing the number of comparisons needed compared to linear search.',
                coreCharacteristics: [
                  'Requires the data structure to be sorted',
                  'Efficient for large datasets due to its logarithmic time complexity',
                  'Reduces the search space by half with each step'
                ],
                keyOperations: [
                  {
                    operation: 'Search',
                    color: 'blue',
                    description: '<b>divides the search interval in half</b> and compares the target element with the middle element. If the target is equal to the middle element, the search is complete. Otherwise, the search continues in the left or right half, depending on the comparison.',
                    bigO: 'log n'
                  }
                ],
                commonApplications: [
                  'Searching in large, sorted datasets',
                  'Used in scenarios where efficiency is critical',
                  'Applicable in database indexing and memory management'
                ]
              }),
              enable: true,
              algorithmTypeId: result.id,
            },
          ],
        });
        break;
      case "sort":
        await prisma.algorithm.createMany({
          data: [
            {
              name: "bubble",
              link: "bubble",
              enable: true,
              description: buildDescription({
                description: 'Bubble Sort is a <b>simple sorting algorithm</b> that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. This process is repeated until the list is sorted.',
                coreCharacteristics: [
                  'Simple and easy to implement',
                  'Inefficient for large datasets due to its quadratic time complexity',
                  'Can be optimized by stopping early if the list is already sorted'
                ],
                keyOperations: [
                  {
                    operation: 'Sort',
                    color: 'blue',
                    description: '<b>compares and swaps adjacent elements</b> to sort the list. This operation is repeated until no more swaps are needed, indicating that the list is sorted.',
                    bigO: 'n^2'
                  }
                ],
                commonApplications: [
                  'Educational purposes to demonstrate sorting principles',
                  'Suitable for small datasets or nearly sorted data',
                  'Used in scenarios where simplicity is preferred over efficiency'
                ]
              }),
              algorithmTypeId: result.id,
            },
            {
              name: "selection",
              link: "selection",
              algorithmTypeId: result.id,
              description: buildDescription({
                description: 'Selection Sort is a <b>simple comparison-based sorting algorithm</b> that works by dividing the list into a sorted and an unsorted region. It repeatedly selects the smallest (or largest) element from the unsorted region and swaps it with the first element in the unsorted region.',
                coreCharacteristics: [
                  'Simple and easy to understand',
                  'Inefficient for large datasets due to its quadratic time complexity',
                  'Performs the same number of comparisons regardless of the initial order'
                ],
                keyOperations: [
                  {
                    operation: 'Sort',
                    color: 'blue',
                    description: '<b>selects the smallest element</b> from the unsorted region and swaps it with the first element in the unsorted region. This process continues until the entire list is sorted.',
                    bigO: 'n^2'
                  }
                ],
                commonApplications: [
                  'Educational purposes to demonstrate sorting principles',
                  'Suitable for small datasets or scenarios with memory constraints',
                  'Used in scenarios where simplicity is preferred over efficiency'
                ]
              }),
              enable: true,
            },
            {
              name: "insertion",
              link: "insertion",
              enable: true,
              algorithmTypeId: result.id,
              description: buildDescription({
                description: 'Insertion Sort is a <b>simple and intuitive sorting algorithm</b> that works by building the final sorted array one element at a time. It maintains a sorted region of the array and repeatedly inserts the next unsorted element into its correct position within the sorted region.',
                coreCharacteristics: [
                  'Efficient for small datasets or nearly sorted data',
                  'Adaptive, meaning it performs fewer operations on nearly sorted arrays',
                  'In-place sorting algorithm with a quadratic time complexity in the worst case'
                ],
                keyOperations: [
                  {
                    operation: 'Sort',
                    color: 'blue',
                    description: '<b>inserts each element</b> into its correct position within the sorted region. This operation is repeated until the entire list is sorted.',
                    bigO: 'n^2'
                  }
                ],
                commonApplications: [
                  'Sorting small datasets or nearly sorted data',
                  'Used as a building block for more complex algorithms',
                  'Applicable in scenarios where simplicity and adaptability are preferred'
                ]
              }),
            },
            {
              name: "merge",
              link: "merge",
              algorithmTypeId: result.id,
              enable: true,
              description: buildDescription({
                description: 'Merge Sort is a <b>divide-and-conquer sorting algorithm</b> that splits the input array into smaller subarrays, sorts each subarray, and then merges them back together in sorted order.',
                coreCharacteristics: [
                  'Efficient for large datasets due to its predictable time complexity',
                  'Stable sorting algorithm that preserves the relative order of equal elements',
                  'Requires additional memory for the temporary arrays used during merging'
                ],
                keyOperations: [
                  {
                    operation: 'Sort',
                    color: 'blue',
                    description: '<b>divides the array</b> into two halves, sorts each half, and then merges them back together in sorted order. This process is repeated until the entire array is sorted.',
                    bigO: 'n log n'
                  }
                ],
                commonApplications: [
                  'Sorting large datasets or data that cannot fit entirely in memory',
                  'Used in scenarios where stability and predictable performance are critical',
                  'Applicable in parallel processing and external sorting'
                ]
              }),
            },
            {
              name: "quick",
              link: "quick",
              algorithmTypeId: result.id,
              enable: true,
              description: buildDescription({
                description: 'Quick Sort is a <b>divide-and-conquer sorting algorithm</b> that partitions the input array into smaller subarrays based on a pivot element and recursively sorts the subarrays.',
                coreCharacteristics: [
                  'Efficient for large datasets due to its average-case time complexity',
                  'In-place sorting algorithm that requires minimal extra memory',
                  'Not a stable algorithm, meaning it does not preserve the relative order of equal elements'
                ],
                keyOperations: [
                  {
                    operation: 'Sort',
                    color: 'blue',
                    description: '<b>selects a pivot element</b> and partitions the array so that all elements smaller than the pivot are placed on its left, and all elements greater than the pivot are placed on its right. This process is repeated until the entire array is sorted.',
                    bigO: 'n log n'
                  }
                ],
                commonApplications: [
                  'Sorting large datasets where memory efficiency is critical',
                  'Used in scenarios where average-case performance is preferred',
                  'Applicable in systems where in-place sorting is required'
                ]
              }),
            },
          ],
        });
        break;
      default:
        break;
    }
  }
})();
