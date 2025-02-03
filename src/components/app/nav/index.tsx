'use client'

import LinkList from './linkList';
import { LINKS } from '../../../lib/links';


function Nav() {
    return (
        <div className='flex items-center justify-center gap-4 p-2'>


            {LINKS.map((link, i) => {


                return <LinkList isFirstLvl={true} key={`${link.link}-${i}`} link={link} />



            })}


        </div>
    )
}



export default Nav