import PageComponent from '@/components/app/page/PageComponent'
import AlgorithmService from '@/entities/algorithms/__classes/AlgorithmService';
import { appMetadata } from '@/lib/metadata';

export const metadata = appMetadata({title:'What is an algorithm in computer science?',description:'Learn about algorithms and their implementations.'})

export default async function AlgorithmPage() {
  const algorithmTypes = await AlgorithmService.getAllTypes();
  return (

    <PageComponent entityParent="algorithms" title="What is an algorithm?" entityListTitle="Algorithms can be divided in:" description={<>
      Algorithm is a step-by-step procedure for solving a problem or accomplishing a task. In the context of data structures and algorithms, <b>it is a set of well-defined instructions for performing a specific computational task.</b> Algorithms are fundamental to computer science and play a very important role in designing efficient solutions for various problems. Understanding algorithms is essential for anyone interested in mastering data structures and algorithms.
    </>} image={{
      dark: 'algoimagedark.png',
      light: 'algoimagelight.png'
    }} entityTypes={algorithmTypes} />
  );
}
