import { Primitive } from '@/types';
import {
    useCallback,
} from 'react'
import Node from '../../_classes/Node';
import LinearNodeComponent from '../../_components/LinearNodeComponent';
import { LinearDsActions } from '../../staticArray/type';
type props = {

    node: Node<Primitive>,
    id: number,
    height: number,
    setAnimationIsRunning: (value: boolean) => void;
    handlePushAnimation: (ele: HTMLElement | null, onAnimationEnds: (e: AnimationEvent) => void) => void;
    action?: LinearDsActions
}
const StackNodeComponent = ({ node, height, id, setAnimationIsRunning = () => { }, handlePushAnimation, action = 'push' }: props) => {
    const handleRef = useCallback((element: HTMLDivElement | null) => {
        if (element == null) return
        node.ref = element;
        if (action === 'push' || action === 'fill') {
            handlePushAnimation(node.ref, () => {
                if (action === 'push') setAnimationIsRunning(false)
            })
        }
    }, [action, node])

    return (
        <LinearNodeComponent style={{
            bottom: `${node.position.y}px`,
            height: `${height}px`,

        }} className="linear-node rounded-lg" node={node} dsType={'stack'} key={id} ref={handleRef} />

    )
}
export default StackNodeComponent;