 import LinksComponent from "@/components/app/nav/linksComponent";

import Title from "@/components/ui/Title";
import { LINKS } from "@/lib/links";
import { appMetadata } from "@/lib/metadata";
import { ChevronsRight } from "lucide-react";

export const metadata = appMetadata({title:'Home'});

const ARTICLES = [
  {
    title: 'Why You Should Learn Data Structures and Algorithms',
    description: <p>
      Mastering Data Structures and Algorithms (DSA) is <b className="font-bold text-xl text-app-bauhaus-red dark:text-app-bauhaus-yellow">essential for writing efficient code and acing technical interviews</b>. Just like understanding car mechanics helps drivers handle emergencies, DSA knowledge empowers developers to optimize performance and solve complex problems. With<b className="font-bold text-xl text-app-bauhaus-green"> 75% of FAANG interviews focusing on DSA concepts</b> , these fundamentals are your key to unlocking high-paying software engineering roles and building scalable applications.
    </p>
  },
  {
    title: 'Why Computer Science Concepts Are Hard to Learn',
    description: <p>
      Computer science challenges learners because <b className="font-bold text-xl text-app-bauhaus-red dark:text-app-bauhaus-yellow">critical processes occur at the binary level</b> - invisible to the naked eye. Imagine learning automotive engineering without ever seeing an engine&apos;s internal workings. DSA concepts like memory allocation and algorithmic complexity become abstract theoretical concepts rather than tangible systems. This visualization gap creates a steep <b className="font-bold text-xl text-app-bauhaus-green">learning curve for 68% of CS students </b>  according to ACM research.
    </p>
  },
  {
    title: "How to Master DSA Effectively",
    description: <div className="flex flex-col items-start justify-start gap-2">
      <p>
        Effective DSA learning requires <b className="font-bold text-xl text-app-bauhaus-red dark:text-app-bauhaus-yellow">both conceptual understanding and practical implementation</b>. Just as mechanics need blueprints before repairing engines, developers must visualize data flows before coding. Our interactive platform acts as an X-ray machine for algorithms, revealing the hidden machinery of stacks, queues, and traversal methods.
      </p>
      <p>
        <b>VISUALS OF DSA</b> transforms abstract concepts into engaging visual simulations,<b className="font-bold text-xl text-app-bauhaus-green"> helping 82% of users grasp complex topics faster</b> (2023 user survey). Through hands-on exploration of sorting algorithms and graph traversals, you&apos;ll build the problem-solving muscle memory needed for coding interviews and real-world software development.
      </p>
    </div>
  }
];
export default function Home() {
  return (

    <section className="flex flex-col w-full gap-10 items-center justify-center  mb-10">
      <header className="flex flex-col items-center justify-center gap-4 mt-10">
        <Title xls={5} h={1} title={<>VISUALS OF <span className="text-app-bauhaus-red">D</span><span className="text-app-bauhaus-green">S</span><span className="text-app-bauhaus-yellow">A</span></>} />
        <div className="p-1 px-2 italic">
          <Title xls={2} h={2} bold={1} uppercase={false} title="A visual representation of data structures and algorithms " />
        </div>

      </header>

      <LinksComponent title='' links={LINKS} containerClassname="items-center justify-center" linksContainerClassname="items-center justify-center"/>

      <section className="max-w-[1200px] flex flex-col gap-16 items-center justify-start">
   
      
        {ARTICLES.map((article, i) => {

          return (
            <article key={`${article.title}-${i}`} >

              <div className="flex items-center justify-start gap-2"> <ChevronsRight size={25} /> <Title xls={3} h={3} uppercase={false} title={article.title} /></div>

              <div className="text-xl pt-2">{article.description}</div>
            </article>)
        })}

       

      </section>
    
    </section>
  );
}
