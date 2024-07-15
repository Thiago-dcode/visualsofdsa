import { Primitive } from '@/types';
import {
    useCallback,
} from 'react'
import Node from '../../_classes/Node';
import LinearNodeComponent from '../../_components/LinearNodeComponent';
type props = {

    node: Node<Primitive>,
    id: number,
    height: number,
    setAnimationIsRunning: (value: boolean) => void;
    handlePushAnimation: (ele: HTMLElement | null, onAnimationEnds: (e: AnimationEvent) => void) => void;
    action?: 'add' | 'delete'
}
const StackNodeComponent = ({ node, height, id, setAnimationIsRunning = () => { }, handlePushAnimation }: props) => {
    const handleRef = useCallback((element: HTMLDivElement | null) => {
        if (element == null) return
        node.ref = element;
        handlePushAnimation(node.ref, () => {
            setAnimationIsRunning(false)
        })
    }, [])

    return (
        <LinearNodeComponent style={{
            bottom: `${node.position.y}px`,
            height: `${height}px`,

        }} className="linear-node rounded-lg" node={node} dsType={'stack'} key={id} ref={handleRef} />

    )
}
export default StackNodeComponent;