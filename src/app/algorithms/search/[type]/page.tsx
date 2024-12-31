import SearchView from '@/entities/algorithms/search/view'
import { notFound, redirect } from 'next/navigation';


function SearchPage({ params }: { params: { type: string } }) {
  const typeLower = params.type.toLocaleLowerCase()
  switch (typeLower) {
    case 'linear':
    case 'linear-search':
    case 'linearsearch':
      return <SearchView searchType='linear' />
    case 'binary':
    case 'binary-search':
    case 'binarysearch':
      return <SearchView searchType='binary' />
    default:
      return redirect('/algorithms');
  }
}

export default SearchPage