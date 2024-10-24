'use client'
import { LinkItem } from './type';

import LinkList from './linkList';

const LINKS: LinkItem[] = [{
    name: "Data structures",
    link: "/data-structures",
    children: [
        {
            name: 'linear',
            link: '/data-structures/linear',
            children: [
                {
                    name: 'Stack',
                    link: '/data-structures/linear/stack',
                    children: null,
                },
                {
                    name: 'Queue',
                    link: '/data-structures/linear/queue',
                    children: null,
                },
                {
                    name: 'Static array',
                    link: '/data-structures/linear/static-array',
                    children: null,
                },
                {
                    name: 'Dynamic array',
                    link: '/data-structures/linear/dynamic-array',
                    children: null,
                },
                {
                    name: 'Linked list',
                    link: '/data-structures/linear/linked-list',
                    children: null,
                },
                {
                    name: 'Doubly linked list',
                    link: '/data-structures/linear/doubly-linked-list',
                    children: null,
                },

            ]
        },
        {
            name: 'Non linear',
            link: '/data-structures/non-linear',
            children: [
                {
                    name: 'Graph',
                    link: '/data-structures/non-linear/graph',
                    children: null
                },
                {
                    name: 'Tree',
                    link: '/data-structures/non-linear/tree',
                    children: null
                },
                {
                    name: 'Binary tree search',
                    link: '/data-structures/non-linear/bts',
                    children: null
                },
            ]
        }
    ]
},
{
    name: 'Algorithms',
    link: '/algorithms',
    children: [
        {
            name: 'Search',
            link: '/algorithms/search',
            children: null,
        },
        {
            name: 'Sort',
            link: '/algorithms/sort',
            children: null,
        },
    ]
}


]

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