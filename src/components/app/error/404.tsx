import VisualsofdsaTitle from "@/components/app/VisualsofdsaTitle";
import Link from "next/link";
export default function Error404({ titleLink, link, customTitle, customTitleLink }: { titleLink?: string, link: string, customTitle?: string ,customTitleLink?:string}) {


    return (
        <div className="mt-20 p-6 rounded-lg shadow-md flex flex-col items-center gap-4 justify-center w-full">
            <VisualsofdsaTitle className="text-6xl uppercase font-bold" title="404" /> <h1 className="text-xl font-bold mb-2">{customTitle || `We couldn't find the ${titleLink} you're looking for`}</h1>
            <Link href={`/${link}`} className="text-app-bauhaus-blue hover:text-app-bauhaus-blue-50"><h2 className="text-2xl font-bold">{customTitleLink || `Available ${titleLink}s`}</h2></Link>
        </div>
    )
}