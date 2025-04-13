import { listName, Primitive } from '@/types';
import {
    useCallback,
} from 'react'
import Node from '../_classes/Node';
import LinearNodeComponent from './LinearNodeComponent';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import LinearDs from '../_classes/LinearDs';
type props = {

    node: Node<Primitive>,
    id: number,
    height: number,
    setAnimationIsRunning: (value: boolean) => void;
    handleAddAnimation: (node: Node<Primitive>) => Promise<void>;
    handleFillerAnimation: () => Promise<void>;
    linearDsName: listName, 
    linearDs: LinearDs<Primitive>

}
const StackNodeComponent = ({ node, height, id, setAnimationIsRunning = () => { }, handleAddAnimation,handleFillerAnimation,linearDsName,linearDs }: props) => {
    const handleRef = useCallback(async (element: HTMLDivElement | null) => {
        if (element == null) return
        node.ref = element;
        if(node.isFiller) {
           node.ref.style.visibility = 'hidden';
        }
        if(node.isLastAdd) {
           if(!node.isFiller) await handleAddAnimation(node)
           else await handleFillerAnimation()
        }
       
    }, [node])

    return (
       <HoverCard>
        <HoverCardTrigger>
        <LinearNodeComponent style={{
            bottom: `${node.position.y}px`,
            height: `${height}px`,

        }} className="linear-node rounded-lg" node={node} dsType={linearDsName as 'queue'| 'stack'} key={id} ref={(element) => {handleRef(element)}} />
        </HoverCardTrigger>
        <HoverCardContent  style={{
            position: 'absolute',
            top: ((linearDs.nodeHeight + linearDs.nodeHeightSpacing) * linearDs.maxSize)-node.position.y +linearDs.nodeHeightSpacing+'px',
            }} className="space-y-2">
                <div className="grid gap-2">
                    <div>
                        <h4 className="text-sm font-semibold">Node Info</h4>
                        <div className="text-sm text-muted-foreground">
                            <p><span className="font-medium">Value:</span> {node.data}</p>
                            <p><span className="font-medium">Position:</span> ({node.position.x}, {node.position.y})</p>
                            
                        </div>
                    </div>
                </div>
        </HoverCardContent>
       </HoverCard>

    )
}
export default StackNodeComponent;