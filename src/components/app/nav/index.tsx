
import LinkList from './linkList';
import DataStructureService from '@/entities/data-structures/__classes/DataStructureService';
import AlgorithmService from '@/entities/algorithms/__classes/AlgorithmService';
import { LinkItem } from './type';
import { LINKS } from '@/lib/links'
import { Entities, EntityTypeSimple } from '@/types';
import { buildLinkFromArgs } from '@/lib/utils';
import MobileNav from './MobileNav';        

async function Nav() {

    const [dsTypes, algoTypes] = await Promise.all([DataStructureService.getAllTypesSimple(), AlgorithmService.getAllTypesSimple()]);
    const formatToLinkItem = (entity: Entities, entityTypes: EntityTypeSimple[]): LinkItem[] => {

        return entityTypes.map(({ name, link, enable, children }) => {
            return {
                name, enable, link: '#', children: children.map(child => {
                    return {
                        name: child.name, enable: child.enable, link: buildLinkFromArgs(entity, link, child.link),
                    }
                })
            }
        })
    }

    const _LINKS = LINKS;
    _LINKS[0].children = formatToLinkItem('data-structures', dsTypes)
    _LINKS[1].children = formatToLinkItem('algorithms', algoTypes)
    return (
      <>
        <div className='hidden phone:flex flex-row items-center justify-center gap-4 p-2'>


            {_LINKS.map((link, i) => {


                return <LinkList isFirstLvl={true} key={`${link.link}-${i}`} link={link} />


            })}


        </div>

        <MobileNav links={_LINKS} />
   
        
      </>
    )
}



export default Nav