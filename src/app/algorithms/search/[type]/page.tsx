import Main from '@/components/container/Main';
import PageHeaderTitle from '@/components/pageHeaderTitle';
import { AlgoSearchType } from '@/entities/algorithms/types';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { redirect } from 'next/navigation';


function SearchPage({ params }: { params: { type: string } }) {
  const typeLower = params.type.toLocaleLowerCase()
  let searchType: null | AlgoSearchType = null;
  switch (typeLower) {
    case 'linear':
    case 'linear-search':
    case 'linearsearch':
      searchType = 'linear';
      break;
    case 'binary':
    case 'binary-search':
    case 'binarysearch':
      searchType = 'binary';
      break;
  }
  if (!searchType) return redirect('/algorithms');


  const renderInfo = () => {
    const Info = dynamic(() => import('@/components/ui/info'), {
      ssr: true,
      loading: () => <div className='bg-red-700'>loading</div>
    });
    switch (searchType) {
      case 'linear':
        return (
          <article>
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

          </article>

        )
      case 'binary':
        return (
          <article>
            <header>
              <h2><strong>Binary Search</strong></h2>
              <p>Binary search is an efficient method for finding an element within a <strong className='uppercase'>sorted array</strong>. It repeatedly divides the search interval in half, significantly reducing the number of comparisons needed compared to <Link href={`/algorithms/search/linear`} className='text-blue-500'>linear search.</Link></p>
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
          </article>


        )

    }
  }
  const SearchView = dynamic(() => import('@/entities/algorithms/search/view'), {
    ssr: true,
    loading: () => <div className='bg-red-700'>loading</div>
  });

  return (
    <Main>
      <PageHeaderTitle title={`${searchType} search`} info={renderInfo()} />
      <SearchView searchType={searchType} />

    </Main>
  )
}

export default SearchPage