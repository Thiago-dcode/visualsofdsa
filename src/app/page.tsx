 import LinksComponent from "@/components/app/nav/linksComponent";
import Main from "@/components/container/Main";

import Title from "@/components/ui/Title";
import { LINKS } from "@/lib/links";
import { ArrowRight, ArrowUpRight, ChevronsRight } from "lucide-react";

const ARTICLES = [
  {
    title: 'Why most computer science topics are hard to learn?',
    description: <p>
      Most computer science topics, especially Data Structures and Algorithms (DSA), are challenging to learn because <b className="text-app-bauhaus-yellow">all processes happen while the computer manipulates binary data</b>—something we can&apos;t directly observe. Imagine trying to learn how a car engine works without ever seeing one in action. You’d have to rely solely on imagination to picture its components and mechanics. Difficult, right? This is exactly how DSA can feel.
    </p>

  },
  {
    title: "How to learn DSA effectively?",
    description: <div className="flex flex-col items-start justify-start gap-2">
      <p>
        Practice is essential for learning anything in life. But before diving into implementing algorithms,<b className="text-app-bauhaus-yellow"> it&apos;s important to understand how those algorithms and data structures work under the hood</b>. It’s like trying to drive a car without knowing what a car is.
      </p>
      <p>
        That’s where <b>VISUALS OF DSA</b>  comes into play. VISUALS OF DSA offers an interactive way to explore Data Structures and Algorithms—like <i>opening the car hood for a mechanics student</i>. By visualizing how DSA works, you can gain a deeper understanding and build a solid foundation for hands-on practice.
      </p></div>

  }
]
export default function Home() {
  return (

    <Main className="">

      <header className="flex flex-col items-center justify-center gap-4 mt-10 mb-16">
        <Title xls={5} title="VISUALS OF DSA" />
        <div className=" text-white p-1 px-2 italic">
          <Title xls={2} h={2} bold={1} uppercase={false} title="A visual representation of data structures and algorithms " />
        </div>

      </header>


      <main className="max-w-[1200px] flex flex-col gap-16 items-center justify-start">

        {ARTICLES.map((article, i) => {

          return (
            <article key={`${article.title}-${i}`} >

              <div className="flex items-center justify-start gap-2"> <ChevronsRight size={25} /> <Title xls={3} h={3} uppercase={false} title={article.title} /></div>

              <div className="text-xl pt-2">{article.description}</div>
            </article>)
        })}

        <LinksComponent title='Start exploring Visuals of DSA' links={LINKS}/>

      </main>
      <footer>


      </footer>

    </Main>
  );
}
