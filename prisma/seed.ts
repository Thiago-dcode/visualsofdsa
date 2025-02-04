import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

const dataStructureTypes: Prisma.DataStructureTypeCreateInput[] = [
  {
    name: "linear",
    description:
      "Linear Data Structures are a type of data structure in computer science where data elements are arranged sequentially or linearly. Each element has a previous and next adjacent, except for the first and last elements.",
    enable: true,
    link: "linear",
  },
  {
    name: "non linear",
    description:
      "Non-linear data structures are those where data items are not arranged in a sequential manner, unlike linear data structures. In these data structures, elements are stored in a hierarchical or a network-based structure that does not follow a sequential order.",
    enable: true,
    link: "non-linear",
  },
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
              description: `<article>
  <p>A stack is <b>a linear data structure</b> that follows the <b>Last In, First Out (LIFO)</b> principle. This means that the last element added to the stack is the first one to be removed. Stacks are commonly used in various algorithms and applications, such as managing function calls, undo mechanisms in software, and evaluating expressions.</p>

  <h4 class="font-semibold py-2">Key Operations of a Stack:</h4>

  <ul>
    <li>
      <b class="font-semibold text-green-400">Push:</b> This operation <b>adds an element to the top of the stack</b>. When a new element is pushed onto the stack, it becomes the new top element. The previous top element is now just below the new top element. <br /><b>Time complexity: O(1).</b>
    </li>
    <br />
    <li>
      <b class="font-semibold text-red-400">Pop:</b> This operation <b>removes and returns the top element of the stack</b>. Since the stack follows the LIFO principle, the element that was most recently added is the one that is removed. If the stack is empty, attempting to pop an element will usually result in an error or an undefined value. <br /><b>Time complexity: O(1).</b>
    </li>
    <br />
    <li>
      <b class="font-semibold text-yellow-400">Peek:</b> This operation <b>returns the top element of the stack without removing it</b>. It allows you to inspect the element at the top of the stack without modifying the stack&apos;s state. This is useful when you need to see what the top element is without altering the stack. <br /><b>Time complexity: O(1).</b>
    </li>
  </ul>
</article>`,
            },
            {
              name: "queue",
              link: "queue",
              description: `<article>
            <p> A queue is <b>a linear data structure</b> that follows the <b>First In, First Out (FIFO)</b> principle. This means that the first element added to the queue is the first one to be removed. Queues are commonly used in various algorithms and applications, such as managing tasks in a printer, handling requests in web servers, and implementing breadth-first search (BFS) in graphs.</p>
            <br />
            <h4 className="font-semibold py-2"> Key Operations of a Queue:</h4>

            <ul>
              <li>
                <b className="font-semibold text-green-400"> Enqueue: </b>This operation <b>adds an element to the end of the queue</b>. When a new element is enqueued, it becomes the new rear element, and the previous rear element is now just before the new rear element. <br /><b>Time complexity: O(1).</b>
              </li>
              <br />
              <li>
                <b className="font-semibold text-red-400"> Dequeue: </b>This operation <b>removes and returns the front element of the queue</b>. Since the queue follows the FIFO principle, the element that was first added is the one that is removed. If the queue is empty, attempting to dequeue an element will usually result in an error or an undefined value. <br /><b>Time complexity: O(1).</b>
              </li>
              <br />
              <li>
                <b className="font-semibold text-yellow-400"> Front: </b> This operation <b>returns the front element of the queue without removing it</b>. It allows you to inspect the element at the front of the queue without modifying the queue&lsquo;s state. This is useful when you need to see what the front element is without altering the queue. <br /><b>Time complexity: O(1).</b>
              </li>
            </ul>
          </article>`,
              enable: true,
              dataStructureTypeId: result.id,
            },
            {
              name: "static array",
              link: "static-array",
              description: `<article>
                    <p> A static array is <b>a linear data structure</b> that has a <b>fixed size</b> determined at the time of creation(compiler time). This means that the number of elements in the array is set and cannot be changed dynamically. Static arrays are commonly used in various algorithms and applications where the size of the data set is known in advance, such as storing a collection of items, implementing lookup tables, and representing matrices.</p>
                    <br />
                    <h4 className="font-semibold py-2"> Key Operations of a Static Array:</h4>

                    <ul>
                        <li>
                            <b className="font-semibold text-green-400"> Write: </b> This operation <b>sets the value of an element at a specified index</b>. Since the array size is fixed, writing a value to an existing position is straightforward and efficient. <br /><b>Time complexity: O(1).</b>
                        </li>
                        <br />
                        <li>
                            <b className="font-semibold text-yellow-400"> Access: </b>This operation <b>retrieves an element at a specified index</b>. Since arrays provide direct access to any element via its index, accessing an element is very efficient. <br /><b>Time complexity: O(1).</b>
                        </li>
                        <br />

                        <li>
                            <b className="font-semibold text-purple-400"> Search: </b> This operation is the most complex and time-consuming because the program must start from the beginning of the array, checking each memory address until the desired value is found or the end of the array is reached. This is because, by default, the program does not know which index stores the value, so it must consider the worst-case scenario. <br /><b>Time complexity: O(n).</b>
                        </li>
                    </ul>
                </article>`,
              enable: true,
              dataStructureTypeId: result.id,
            },
            {
              name: "Dynamic Array",
              link: "dynamic-array",
              description: `<article>
                    <p>
                        A dynamic array is <b>a linear data structure</b> similar to <Link target="_blank" className="italic text-app-bauhaus-blue" href={'/data-structures/linear/static-array'}>static arrays</Link>, but it can grow in size dynamically; in other words, the array size isn&apos;t static. To accomplish this dynamic growth, the array first sets an <b className="text-app-bauhaus-yellow">initial capacity</b> (not the actual size), and when the size grows and there isn&apos;t enough space, the array is copied to a new array with double the capacity.
                    </p>
                    <br />
                    <p>
                        Besides the <Link target="_blank" className="italic text-app-bauhaus-blue" href={'/data-structures/linear/static-array'}>static arrays</Link> operations, dynamic arrays have their own operations:
                    </p>

                    <h4 className="font-semibold py-2">Key Operations of a Dynamic Array:</h4>
                    <br />
                    <ul>
                        <li>
                            <b className="font-semibold text-app-bauhaus-green">Push:</b> This operation <b>adds a new element after the last position</b>, increasing the array&apos;s size by one. Sometimes the array must be copied to a new array due to lack of space, so in this situation, the push operation will take O(n). <br /><b>Overall time complexity: O(1).</b>
                        </li>
                        <br />
                        <li>
                            <b className="font-semibold text-app-bauhaus-red">Pop:</b> This operation <b>deletes the element at the last position</b>. <br /><b>Time complexity: O(1).</b>
                        </li>
                        <br />
                        <li>
                            <b className="font-semibold text-app-bauhaus-orange">Insert:</b> This operation <b>adds an element at a specific position by a given index</b>. To accomplish this operation, all elements on the right side of the desired position must be shifted towards the right before the new element is inserted, and then the new element is written in the released position.<br /><b>Time complexity: O(n).</b>
                        </li>
                        <br />
                        <li>
                            <b className="font-semibold text-app-bauhaus-red">Delete:</b> This operation <b>removes an element from a specific position by a given index</b>. To accomplish this operation, the program first deletes the desired element, and then all elements on the right side must be shifted to the left, taking the place of the deleted element. <br /><b>Time complexity: O(n).</b>
                        </li>
                        <br />
                    </ul>
                </article>`,
              enable: true,
              dataStructureTypeId: result.id,
            },
            {
              name: "Linked List",
              link: "linked-list",
              description: `<article> <p>A <b>Linked List</b> is a <b>linear data structure</b> consisting of nodes, where each node contains a value and a pointer (or reference) to the <b>next</b> node in the sequence. Unlike arrays, linked lists do not require contiguous memory locations, making them more flexible for dynamic memory allocation. Linked lists are particularly useful when frequent insertions and deletions are required, especially at the head or tail.</p>

            <h4 className="font-semibold py-2">Key Operations of a Linked List:</h4>

            <ul>
                <li>
                    <b className="font-semibold text-green-400"> Add: </b>
                    This operation <b>adds a new node to the linked list</b>. The new node can be inserted at the head, tail, or a specific position. The pointer of the previous node needs to be updated to maintain the structure. <br />
                    <b>Time complexity:</b> O(1) for insertion at the head, O(n) for insertion at a specific position or at the tail (if traversing is needed).
                </li>
                <br />
                <li>
                    <b className="font-semibold text-red-400"> Delete: </b>
                    This operation <b>removes a node from the linked list</b>. The node to be deleted could be anywhere in the list, and the pointer of the previous node must be adjusted to skip over the deleted node. <br />
                    <b>Time complexity:</b> O(1) for deletion at the head, O(n) for deletion at a specific position or at the tail (if traversing is needed).
                </li>
                <br />
                <li>
                    <b className="font-semibold text-yellow-400"> Get: </b>
                    This operation <b>finds and returns the first node that contains the desired value</b>. The list must be traversed from the head until the value is found or the end is reached. <br />
                    <b>Time complexity:</b> O(n), as each node needs to be checked sequentially.
                </li>
            </ul>

        </article>`,
              enable: true,
              dataStructureTypeId: result.id,
            },
            {
              name: "Doubly Linked List",
              link: "doubly-linked-list",
              description: `<article>
                <p>A <b>Doubly Linked List</b> is a <b>linear data structure</b> consisting of nodes, where each node contains a value and two pointers (or references): one pointing to the <b>next</b> node and another pointing to the <b>previous</b> node in the sequence. This bidirectional navigation allows more efficient operations, especially for traversal in both directions. Doubly linked lists are particularly useful when frequent insertions and deletions are required at both ends of the list.</p>

                <h4 className="font-semibold py-2">Key Operations of a Doubly Linked List:</h4>

                <ul>
                    <li>
                        <b className="font-semibold text-green-400"> Add: </b>
                        This operation <b>adds a new node to the doubly linked list</b>. The new node can be inserted at the head, tail, or in a specific position. The previous and next pointers need to be updated to maintain the structure. <br />
                        <b>Time complexity:</b> O(1) for insertion at the head or tail, O(n) for insertion at a specific position.
                    </li>
                    <br />
                    <li>
                        <b className="font-semibold text-red-400"> Delete: </b>
                        This operation <b>removes a node from the doubly linked list</b>. The node to be deleted could be anywhere in the list, and both the previous and next pointers of neighboring nodes need to be adjusted. <br />
                        <b>Time complexity:</b> O(1) for deletion at the head or tail, O(n) for deletion at a specific position.
                    </li>
                    <br />
                    <li>
                        <b className="font-semibold text-yellow-400"> Get: </b>
                        This operation <b>finds and returns the first node that contains the desired value</b>. Since a doubly linked list can be traversed from both the head and the tail, searching can be done in either direction. <br />
                        <b>Time complexity:</b> O(n), as each node still needs to be checked sequentially.
                    </li>
                </ul>
            </article>)
        }`,
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
              name: "bts",
              link: "bts",
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
              description: `<article>
            <header>

              <p>Linear search or sequential search is a method for finding an element within an array by <b>sequentially checking</b> (or traverse) each element until a match is found or the entire list has been searched**.</p>
            </header>
            <br />
            <main>
              <p>**If the array is <strong>sorted</strong>, you can make the linear search algorithm more efficient by leveraging the order of elements:</p>
              <br />
              <div>
                <p>For example, if the target element is <b>greater</b> than the last element in a sorted array (or <b>less</b> than the last element in a descending-sorted array), you can conclude that the target is not present and skip further checks.</p>

                <p>Another optimization involves checking the <b>next element in the loop</b>. If the next element (e.g., <code>array[index + 1]</code>) is <b>greater</b> than the <b>target</b> element, you can safely conclude that the target is not in the array and break the loop. For example, if you are looking for 5 in <code>[2, 4, 7]</code>, when you reach 4, you can check the next element (7), which is greater than 5, and determine that 5 cannot be found in the remaining array. (Note: the same principle applies in a descending-sorted array.)</p>


              </div>
            </main>
            <br />
            <footer>
              <p>In conclusion, regardless of whether the array is sorted or unsorted, the time complexity of the linear search algorithm remains <b>O(n)</b>, as Big O Notation dictates, it always accounts for <b> the worst-case scenario </b> where all elements must be checked.</p>
            </footer>

          </article>`,
            },
            {
              name: "binary",
              link: "binary",
              description: `<article>
            <header>
              <h2><strong>Binary Search</strong></h2>
              <p>Binary search is an efficient method for finding an element within a <strong className='uppercase'>sorted array</strong>. It repeatedly divides the search interval in half, significantly reducing the number of comparisons needed compared to <Link href={"/algorithms/search/linear"} className='text-blue-500'>linear search.</Link></p>
            </header>
            <br />
            <main>
              <div>
                <p>Steps that binary algorithm takes to find the target value:</p>

                <ul>
                  <li><b>Step 1:</b> Compare the target element with the middle element of the array.</li>
                  <li><b>Step 2:</b> If the target is equal to the middle element, the search is complete.</li>
                  <li><b>Step 3:</b> If the target is less than the middle element, repeat the search on the left half of the array.</li>
                  <li><b>Step 4:</b> If the target is greater than the middle element, repeat the search on the right half of the array.</li>
                </ul>

                <p>This process of halving the search interval continues until the target element is found or the interval is empty, indicating that the target is not present in the array.</p>

              </div>
            </main>
            <br />
            <footer>
              <p>In conclusion, the time complexity of the binary search algorithm is <b>O(log n)</b>, as Big O Notation dictates, it efficiently narrows down the search space by halving it with each step, making it <b>significantly faster than linear search</b> for large, sorted arrays.</p>
            </footer>
          </article>`,
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
              description: `<article>
                    <header>
                        <p>
                            Bubble Sort is a <b>simple sorting algorithm</b> that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. This process is repeated until the list is sorted.
                        </p>
                    </header>
                    <br />
                    <main>
                        <p>
                            **Although Bubble Sort is easy to understand and implement, it is not efficient for large datasets. However, there are a few optimizations that can improve its performance in specific scenarios:
                        </p>
                        <br />
                        <div>
                            <p>
                                For example, if during a single pass through the array no swaps are made, it means the array is already sorted, and you can terminate the algorithm early. This optimization is called the <b>flagged optimization</b> and reduces unnecessary passes over a sorted or nearly sorted array.
                            </p>
                            <p>
                                Another optimization involves reducing the range of elements to compare in each pass. Since the largest element &quot;bubbles up&quot; to its correct position after each pass, you can ignore the last sorted elements in subsequent iterations. This decreases the number of comparisons over time.
                            </p>
                        </div>
                    </main>
                    <br />
                    <footer>
                        <p>
                            In conclusion, while Bubble Sort is generally inefficient with a time complexity of  <b className='font-bold'>O(n²)</b> in the average and worst cases, these optimizations can improve its performance on specific datasets, such as nearly sorted arrays. However, its simplicity makes it a good choice for educational purposes and visualizations.
                        </p>
                    </footer>
                </article>`,
              algorithmTypeId: result.id,
            },
            {
              name: "selection",
              link: "selection",
              algorithmTypeId: result.id,
              description: `<article>
                    <header>
                        <p>
                            Selection Sort is a <b>simple comparison-based sorting algorithm</b> that works by dividing the list into a sorted and an unsorted region. It repeatedly selects the smallest (or largest, depending on the order) element <span className='text-app-bauhaus-red'>(red color)</span> from the unsorted region and swaps it with the first element in the unsorted region, expanding the sorted region with each iteration.
                        </p>
                    </header>
                    <br />
                    <main>
                        <p>
                            **Selection Sort is straightforward to implement, but its performance is limited by its high number of comparisons. However, its deterministic nature makes it suitable for small datasets or scenarios where memory usage is constrained.
                        </p>
                        <br />
                        <div>
                            <p>
                                For example, in each pass through the array, Selection Sort identifies the smallest element in the unsorted region and swaps it with the element at the start of the unsorted region. This process continues until the entire array is sorted.
                            </p>
                            <p>
                                Unlike some other sorting algorithms, Selection Sort performs the same number of comparisons regardless of the initial order of the array. This makes it predictable but not adaptive to already sorted or nearly sorted data.
                            </p>
                        </div>
                    </main>
                    <br />
                    <footer>
                        <p>
                            In conclusion, Selection Sort has a time complexity of <b className='font-bold'>O(n²)</b> in both the average and worst cases. While it is not as efficient as other algorithms for large datasets, its simplicity and lack of additional memory requirements make it useful for learning and for specific use cases where memory is a priority.
                        </p>
                    </footer>
                </article>`,
              enable: true,
            },
            {
              name: "insertion",
              link: "insertion",
              enable: true,
              algorithmTypeId: result.id,
              description: `<article>
                    <header>
                        <p>
                            Insertion Sort is a <b>simple and intuitive sorting algorithm</b> that works by building the final sorted array one element at a time. It maintains a sorted region of the array and repeatedly inserts the next unsorted element into its correct position within the sorted region.
                        </p>
                    </header>
                    <br />
                    <main>
                        <p>
                            **Insertion Sort is particularly efficient for small datasets or arrays that are already partially sorted, as it minimizes the number of required comparisons and shifts.
                        </p>
                        <br />
                        <div>
                            <p>
                                For example, during each pass, the algorithm takes the first element of the unsorted region and compares it with the elements in the sorted region, moving elements one position to the right until the correct position is found. The element is then inserted into its correct position, and the sorted region expands.
                            </p>
                            <p>
                                This behavior makes Insertion Sort adaptive, meaning it performs fewer operations on nearly sorted arrays. It is often used as a building block for more complex algorithms or for sorting small subsets of data.
                            </p>
                        </div>
                    </main>
                    <br />
                    <footer>
                        <p>
                            In conclusion, the time complexity of Insertion Sort is <b>O(n²)</b> in the worst case but <b>O(n)</b> in the best case, such as when the array is already sorted. Its simplicity, adaptability, and in-place sorting nature make it suitable for small or nearly sorted datasets, despite its limitations for large arrays.
                        </p>
                    </footer>
                </article>`,
            },
            {
              name: "merge",
              link: "merge",
              algorithmTypeId: result.id,
              enable: true,
              description: `<article>
                    <header>
                        <p>
                            <strong>Merge Sort</strong> is a <b>divide-and-conquer sorting algorithm</b> that splits the input array into smaller subarrays, sorts each subarray, and then merges them back together in sorted order. It is highly efficient for <strong>large datasets</strong> due to its <b>predictable time complexity</b> and <b>suitability for parallel processing</b>.
                        </p>
                    </header>
                    <br />
                    <main>
                        <p>
                            **Merge Sort works by <b>recursively dividing</b> the array into two halves until each subarray contains only a single element (or is empty). These smaller arrays are inherently sorted, and the algorithm proceeds to <strong>merge</strong> them in a way that maintains sorted order.
                        </p>
                        <br />
                        <div>
                            <p>
                                For example, if the array is <code>[38, 27, 43, 3, 9, 82, 10]</code>, Merge Sort first <b>divides</b> it into two halves: <code>[38, 27, 43]</code> and <code>[3, 9, 82, 10]</code>. Each of these halves is further divided until individual elements are isolated: <code>[38]</code>, <code>[27]</code>, <code>[43]</code>, and so on. The algorithm then <b>merges</b> these elements back together in sorted order, resulting in <code>[3, 9, 10, 27, 38, 43, 82]</code>.
                            </p>
                            <p>
                                During the <strong>merging phase</strong>, Merge Sort <b>compares</b> the smallest elements of each subarray and <b>appends</b> the smaller element to the resulting merged array. This process is repeated until all elements are merged. The <strong>merging step</strong> is key to the algorithm&apos;s efficiency, as it ensures that each merge operation processes only the required comparisons and shifts.
                            </p>
                            <p>
                                Merge Sort is a <b>stable algorithm</b>, meaning it preserves the <strong>relative order</strong> of elements with equal values. This property, combined with its <b>predictable performance</b>, makes it a popular choice for sorting <strong>large datasets</strong> or implementing complex systems like database queries and <b>external sorting</b> for data that exceeds memory capacity.
                            </p>
                        </div>
                    </main>
                    <br />
                    <footer>
                        <p>
                            In conclusion, Merge Sort has a consistent <b>time complexity</b> of <strong>O(n log n)</strong> for all cases—best, average, and worst. Its <b>space complexity</b> is <strong>O(n)</strong> due to the additional arrays used during the merging process. While its memory usage can be a limitation, Merge Sort&apos;s <b>stability</b> and <strong>efficiency</strong> make it a powerful tool for sorting large datasets, particularly when the data cannot fit entirely in memory.
                        </p>
                    </footer>
                </article>`,
            },
            {
              name: "quick",
              link: "quick",
              algorithmTypeId: result.id,
              enable: true,
              description: `<article>
                        <header>
                            <p>
                                <strong>Quick Sort</strong> is a <b>divide-and-conquer sorting algorithm</b> that partitions the input array into smaller subarrays based on a pivot element and recursively sorts the subarrays. It is highly efficient for <strong>large datasets</strong> due to its <b>average-case time complexity</b> and <b>in-place sorting capability</b>.
                            </p>
                        </header>
                        <br />
                        <main>
                            <p>
                                **Quick Sort works by selecting a <b>pivot element</b> and <strong>partitioning</strong> the array so that all elements smaller than the pivot are placed on its left, and all elements greater than the pivot are placed on its right. This partitioning process creates two subarrays, which are then recursively sorted.
                            </p>
                            <br />
                            <div>
                                <p>
                                    For example, if the array is <code>[38, 27, 43, 3, 9, 82, 10]</code> and the last element, <code>10</code>, is chosen as the pivot, the partitioning process begins by comparing each element to the pivot. The algorithm rearranges the array into <code>[3, 9, 10, 43, 38, 82, 27]</code>, placing all elements smaller than <code>10</code> to its left and larger elements to its right.
                                </p>
                                <p>
                                    After partitioning, the pivot (<code>10</code>) is in its correct sorted position. Quick Sort then recursively applies the same process to the subarray on the left (<code>[3, 9]</code>) and the subarray on the right (<code>[43, 38, 82, 27]</code>). This process continues until all subarrays are sorted, resulting in the final sorted array: <code>[3, 9, 10, 27, 38, 43, 82]</code>.
                                </p>
                                <p>
                                    During the <strong>partitioning phase</strong>, Quick Sort swaps elements to ensure proper placement around the pivot. Choosing the last element as the pivot is a common approach, but it may lead to inefficiency in already sorted or reverse-sorted arrays, as the partitioning becomes unbalanced.
                                </p>
                                <p>
                                    While Quick Sort is not a <b>stable algorithm</b>, meaning it does not preserve the <strong>relative order</strong> of equal elements, its <b>in-place sorting</b> nature (requiring minimal extra memory) and <strong>efficient average-case performance</strong> make it suitable for large datasets where memory efficiency is critical.
                                </p>
                            </div>
                        </main>
                        <br />
                        <footer>
                            <p>
                                In conclusion, Quick Sort has a <b>time complexity</b> of <strong>O(n log n)</strong> in the average case and <b>O(n²)</b> in the worst case, such as when the pivot divides the array unevenly. Its <b>space complexity</b> is <strong>O(log n)</strong> due to recursive calls. Despite its sensitivity to pivot selection, Quick Sort&apos;s <b>efficiency</b> and <strong>low memory usage</strong> make it one of the most widely used sorting algorithms for large datasets.
                            </p>
                        </footer>
                    </article>`,
            },
          ],
        });
        break;
      default:
        break;
    }
  }
})();
