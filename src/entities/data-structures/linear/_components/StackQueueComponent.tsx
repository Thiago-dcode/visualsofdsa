import { listName, Primitive } from '@/types';
import {
    useCallback,
} from 'react'
import Node from '../_classes/Node';
import LinearNodeComponent from './LinearNodeComponent';
type props = {

    node: Node<Primitive>,
    id: number,
    height: number,
    setAnimationIsRunning: (value: boolean) => void;
    handleAddAnimation: (node: Node<Primitive>) => Promise<void>;
    handleFillerAnimation: () => Promise<void>;
    linearDsName: listName

}
const StackNodeComponent = ({ node, height, id, setAnimationIsRunning = () => { }, handleAddAnimation,handleFillerAnimation,linearDsName }: props) => {
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
        <LinearNodeComponent style={{
            bottom: `${node.position.y}px`,
            height: `${height}px`,

        }} className="linear-node rounded-lg" node={node} dsType={linearDsName as 'queue'| 'stack'} key={id} ref={(element) => {handleRef(element)}} />

    )
}
export default StackNodeComponent;