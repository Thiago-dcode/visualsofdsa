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
    dsType?: 'queue' | 'stack',
    action?: 'add' | 'delete'
}
const StackNodeComponent = ({ node, height, id, setAnimationIsRunning = () => { }, handlePushAnimation, dsType = 'stack' }: props) => {
    const handleRef = useCallback((element: HTMLDivElement | null) => {
        if (element == null) return
        node.ref = element;
        handlePushAnimation(node.ref, () => {
            setAnimationIsRunning(false)
        })
    }, [])

    return (
        <LinearNodeComponent node={node} height={height} dsType={dsType} key={id} ref={handleRef} />

    )
}
export default StackNodeComponent;