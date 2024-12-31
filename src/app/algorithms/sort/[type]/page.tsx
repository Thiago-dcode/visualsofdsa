import SearchView from '@/entities/algorithms/search/view'
import SortView from '@/entities/algorithms/sort/view';
import { notFound, redirect } from 'next/navigation';


function SortPage({ params }: { params: { type: string } }) {
    const typeLower = params.type.toLocaleLowerCase()
    switch (typeLower) {
        case 'bubble':
        case 'bubble-sort':
        case 'bubblesort':
            return <SortView algoSortType='bubble' />
        case 'insertion':
        case 'insertion-sort':
        case 'insertionsort':
            return <SortView algoSortType='insertion' />
        case 'merge':
        case 'merge-sort':
        case 'mergesort':
            return <SortView algoSortType='merge' />
        case 'selection':
        case 'selection-sort':
        case 'selectionsort':
            return <SortView algoSortType='selection' />
        case 'quick':
        case 'quick-sort':
        case 'quicksort':
            return <SortView algoSortType='quick' />
        default:
            return redirect('/algorithms');
    }
}

export default SortPage