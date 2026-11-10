import {
    type EntityID,
    type ISceneTree,
    type SceneNode,
    type SceneNodeContent,
    type SceneTreePosition,
} from '../../types'

export class SceneTree implements ISceneTree {
    #nodes: SceneNode = new Map()

    public getNodeContentAt(position: SceneTreePosition) {
        let currentTreeNode = this.#nodes.get(position[0]!)

        for (let i = 1; i < position.length; i++) {
            currentTreeNode = currentTreeNode?.children?.get(position[i]!)
        }

        return currentTreeNode ?? null
    }

    public addNodeAt(
        position: SceneTreePosition | null,
        nodeContent: SceneNodeContent
    ): SceneTreePosition {
        if (!position) {
            this.#nodes.set(nodeContent.gameObject.id, nodeContent)

            return [nodeContent.gameObject.id]
        }

        let currentTreeNode = this.getNodeContentAt(position)

        currentTreeNode?.children?.set(nodeContent.gameObject.id, nodeContent)

        return [...position, nodeContent.gameObject.id]
    }

    public reparentNode(
        target: SceneTreePosition | null,
        child: SceneTreePosition
    ): SceneTreePosition {
        const nodeContent = this.getNodeContentAt(child)

        if (!nodeContent) {
            throw new Error(`No node found at position ${child.join()}`)
        }

        const newPosition = this.addNodeAt(target, nodeContent)
        this.removeNode(child)

        return newPosition
    }

    public removeNode(targetPosition: SceneTreePosition): EntityID[] {
        const targetId = targetPosition[targetPosition.length - 1]!
        const parentPosition = targetPosition.slice(
            0,
            targetPosition.length - 1
        )

        // the sibling map holding the target: the root map for top-level
        // nodes, otherwise the parent's children
        const siblings =
            parentPosition.length === 0
                ? this.#nodes
                : this.getNodeContentAt(parentPosition)?.children

        const removedIds: EntityID[] = []
        const targetNode = siblings?.get(targetId)
        if (targetNode) {
            // collect the target's OWN subtree only — traversing the parent's
            // children would report sibling ids too, and ObjectManager would
            // then discard their position records
            const targetAsNode: SceneNode = new Map([[targetId, targetNode]])
            this.#traverseNode(targetAsNode, (nodeId) => {
                removedIds.push(nodeId)
            })
        }

        siblings?.delete(targetId)

        return removedIds
    }

    #traverseNode(
        node: SceneNode | null | undefined,
        callback: (nodeId: EntityID, nodeContent: SceneNodeContent) => void
    ) {
        const iterate = (sceneNode?: SceneNode | null) => {
            if (!sceneNode) return

            sceneNode.forEach((value, key) => {
                callback(key, value)
                iterate(value.children)
            })
        }

        iterate(node)
    }

    get nodes() {
        return this.#nodes
    }
}
