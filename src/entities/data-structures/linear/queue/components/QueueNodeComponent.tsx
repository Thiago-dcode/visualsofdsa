import { Primitive } from '@/types';
import {
    useCallback
} from 'react'

import LinearNodeComponent from '../../_components/LinearNodeComponent';
import UseQueueAnimation from '../hooks/UseQueueAnimation';
import Queue from '../classes/Queue';

import LinkedListNode from '../../linkedList/classes/LinkedListNode';
type props = {

    node: LinkedListNode<Primitive>,
    id: number,
    height: number,
    queue: Queue<Primitive>,
    setIsAnimationRunning: (bool: boolean) => void,


}
const QueueNodeComponent = ({ node, height, id, queue, setIsAnimationRunning }: props) => {
    const { enqueueAnimation } = UseQueueAnimation(queue)

    const handleRef = useCallback((element: HTMLElement | HTMLDivElement | null) => {
        if (!element) return
        node.ref = element;
        if (queue.size - 1 === id) {
            enqueueAnimation(node.ref, () => {
                setIsAnimationRunning(false)
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    return (
        <LinearNodeComponent style={{
            top: `${node.position.y}px`,
            height: `${height}px`,

        }} className="linear-node rounded-lg" node={node} dsType={'queue'} ref={handleRef} />

    )
}
export default QueueNodeComponent;