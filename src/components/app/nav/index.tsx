'use client'
import { LinkItem } from './type';

import LinkList from './linkList';

const LINKS: LinkItem[] = [{
    name: "Data structures",
    link: "/data-structures",
    enable: true,
    children: [
        {
            name: 'linear',
            link: '/data-structures/linear',
            enable: true,
            children: [
                {
                    name: 'Stack',
                    link: '/data-structures/linear/stack',
                    children: null,
                    enable: true,
                },
                {
                    name: 'Queue',
                    link: '/data-structures/linear/queue',
                    children: null,
                    enable: true,
                },
                {
                    name: 'Static array',
                    link: '/data-structures/linear/static-array',
                    children: null,
                    enable: true,
                },
                {
                    name: 'Dynamic array',
                    link: '/data-structures/linear/dynamic-array',
                    children: null,
                    enable: true,
                },
                {
                    name: 'Linked list',
                    link: '/data-structures/linear/linked-list',
                    children: null,
                    enable: true,
                },
                {
                    name: 'Doubly linked list',
                    link: '/data-structures/linear/doubly-linked-list',
                    children: null,
                    enable: true,
                },

            ]
        },
        {
            name: 'Non linear',
            link: '/data-structures/non-linear',
            enable: true,
            children: [
                {
                    name: 'Graph',
                    link: '/data-structures/non-linear/graph',
                    children: null,
                    enable: false,
                },
                {
                    name: 'Tree',
                    link: '/data-structures/non-linear/tree',
                    children: null,
                    enable: false,
                },
                {
                    name: 'Binary tree search',
                    link: '/data-structures/non-linear/bts',
                    children: null,
                    enable: false,
                },
            ]
        }
    ]
},
{
    name: 'Algorithms',
    link: '/algorithms',
    enable: false,
    children: [
        {
            name: 'Search',
            link: '/algorithms/search',
            children: null,
            enable: false,
        },
        {
            name: 'Sort',
            link: '/algorithms/sort',
            children: null,
            enable: false,
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