import Main from "@/components/container/Main";
import { links } from "@/config";
import Link from "next/link";


export default function Home() {
    return (

        <Main>

            {
                Object.entries(links["data-structures"]).map(([key, value], i) => {

                    return (
                        <div key={i}>
                            <Link href={'/data-structures/' + key} >{key}</Link>
                        </div>
                    )
                })
            }

        </Main>
    );
}
