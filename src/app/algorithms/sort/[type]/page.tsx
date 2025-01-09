import Main from '@/components/container/Main';
import PageHeaderTitle from '@/components/pageHeaderTitle';
import SearchView from '@/entities/algorithms/search/view'
import SortView from '@/entities/algorithms/sort/view';
import { AlgoSortType } from '@/entities/algorithms/types';

import dynamic from 'next/dynamic';
import { notFound, redirect } from 'next/navigation';


function SortPage({ params }: { params: { type: string } }) {
    const typeLower = params.type.toLocaleLowerCase();
    let algoSortType: AlgoSortType | null = null;
    switch (typeLower) {
        case 'bubble':
        case 'bubble-sort':
        case 'bubblesort':
            algoSortType = 'bubble';
            break;
        case 'insertion':
        case 'insertion-sort':
        case 'insertionsort':
            algoSortType = 'insertion';
            break;
        case 'merge':
        case 'merge-sort':
        case 'mergesort':
            algoSortType = 'merge';
            break;
        case 'selection':
        case 'selection-sort':
        case 'selectionsort':
            algoSortType = 'selection';
            break;
        case 'quick':
        case 'quick-sort':
        case 'quicksort':
            algoSortType = 'quick';
            break;
    }
    if (!algoSortType) return redirect('/algorithms');

    const renderInfo = () => {
        switch (algoSortType) {
            case 'bubble':
                return (<article>
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
                </article>)
            case 'selection':
                return (<article>
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
                </article>
                )
            case 'insertion':
                return (<article>
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
                </article>
                )
            case 'merge':
                return (<article>
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
                </article>
                )
            case 'quick':
                return (
                    <article>
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
                    </article>)
        }
    }

    const SortView = dynamic(() => import('@/entities/algorithms/sort/view'), {
        ssr: true,
        loading: () => <div className='bg-red-700'>loading</div>
    });

    return (
        <Main>
            <PageHeaderTitle title={`${algoSortType} sort`} info={renderInfo()} />
            <SortView algoSortType={algoSortType} />
        </Main>
    )
}

export default SortPage