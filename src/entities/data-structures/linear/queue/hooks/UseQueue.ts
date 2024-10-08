import { Primitive } from "@/types";
import  { useEffect, useState } from "react";
import Queue from "../classes/Queue";
import "../../style.css";
import UseQueueAnimation from "./UseQueueAnimation";

function UseQueue() {
  const [queue, setQueue] = useState<Queue<Primitive> | null>(null);
  const [isStackOverFlow, setIsStackOverFlow] = useState(false);
  const { dequeueAnimation, moveAnimation } = UseQueueAnimation(queue);
  const enqueue = (data: Primitive): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (!queue) {
        reject(false);
      } else {
        if (queue.size >= queue?.maxSize) {
          setIsStackOverFlow(true);
          reject(false);
        } else {
          queue?.enqueue(data);
          resolve(true);
        }
      }
    });
  };
  const dequeue = async (callback = () => {}): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      if (!queue) {
        reject(false);
      } else {
        const nodes = queue.toNodeArray;
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          if (i === 0) {
            await dequeueAnimation(node.ref, () => {
              queue.dequeue();
            });

            continue;
          }

          moveAnimation(node.ref, i, () => {
            node.position.y =
              (queue.nodeHeight + queue.nodeHeightSpacing) * (i - 1) +
              queue.nodeHeightSpacing;
          });
        }
        resolve(true);
      }

      callback();
    });
  };

  useEffect(() => {
    setQueue(new Queue());
   
  }, []);

  return {
    enqueue,
    queue,
    dequeue,

    isStackOverFlow,
    setIsStackOverFlow,
  };
}
export default UseQueue;
