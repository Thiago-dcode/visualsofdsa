import { listName, Primitive } from '@/types';
import {
    useCallback,
} from 'react'
import Node from '../_classes/Node';
import LinearNodeComponent from './LinearNodeComponent';
import LinearDs from '../_classes/LinearDs';
type props = {

    node: Node<Primitive>,
    id: number,
    height: number,
    handleAddAnimation: (node: Node<Primitive>) => Promise<void>;
    handleFillerAnimation: () => Promise<void>;
    linearDsName: listName,
    linearDs: LinearDs<Primitive>

}
const StackNodeComponent = ({ node, height, id, handleAddAnimation, handleFillerAnimation, linearDsName, linearDs }: props) => {
    const handleRef = useCallback(async (element: HTMLDivElement | null) => {
        if (element == null) return
        node.ref = element;
        if (node.isFiller) {
            node.ref.style.visibility = 'hidden';
        }
        if (node.isLastAdd) {
            if (!node.isFiller) await handleAddAnimation(node)
            else await handleFillerAnimation()
        }

    }, [node])

    return (
        <LinearNodeComponent style={{
            bottom: `${node.position.y}px`,
            height: `${height}px`,
        }} className="linear-node rounded-lg" node={node} dsType={linearDsName as 'queue' | 'stack'} key={id} ref={(element) => { handleRef(element) }} hoverContentStyle={{
            position: 'absolute',
            zIndex: 100,
            top:( ((linearDs.nodeHeight + linearDs.nodeHeightSpacing) * linearDs.maxSize) - node.position.y + linearDs.nodeHeightSpacing ) + 'px',
            left: (linearDs.width/7) + 'px',
        }} />



    )
}
export default StackNodeComponent;