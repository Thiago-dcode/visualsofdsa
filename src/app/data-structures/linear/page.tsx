import Main from "@/components/container/Main";
import { links } from "@/config";
import Link from "next/link";



export default function Linear() {
    return (

        <Main>

            {
                links["data-structures"].linear.map((ds, i) => {

                    return (
                        <div key={i}>
                           <Link href={'/data-structures/linear/'+ds}>{ds}</Link>
                        </div>
                    )
                })
            }

        </Main>
    );
}
