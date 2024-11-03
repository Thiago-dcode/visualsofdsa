import SearchAlgorithm from "../_classes/SearchAlgorithm";
import Node from "@/entities/data-structures/linear/_classes/Node";
import { Direction, Primitive, speed } from "@/types";
import "@/entities/data-structures/linear/staticArray/style.css";
import { animate } from "@/lib/animations";
import { toast } from "sonner";
export default function useSearchAlgorithm(
  array: Node<Primitive>[] | null,
  speed: speed = 1
) {
  const linear = async (
    search: Primitive,
    isSorted: boolean,
    direction: Direction
  ) => {
    if (!array) {
      toast.error(`Expected an array, null given`, {
        position: "top-center",
      });
      return;
    }
    let steps = 0;
    let _index = 0;

    const node = await SearchAlgorithm.linear(
      array,
      search,
      async (node, index, found) => {
        _index = index;
        steps++;

        if (node.ref) {
          await animate(
            node.ref,
            !found
              ? `search-node ${speed === 1 ? 0.4 : speed === 2 ? 0.3 : 0.1}s`
              : "access-node 0.7s"
          );
          if (found) {
            toast.success(
              `${search} found on index ${index}. Steps: ${steps || 1}`,
              {
                position: "top-center",
              }
            );
          }
        }
      },
      isSorted,
      direction
    );

    if (!node) {
      toast.info(`${search} not presented in the array. Steps: ${steps || 1}`, {
        position: "top-center",
      });
    }
  };

  return { linear };
}
