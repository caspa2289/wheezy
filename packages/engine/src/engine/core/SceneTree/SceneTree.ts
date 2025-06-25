import {
    EntityID,
    ISceneTree,
    SceneNode,
    SceneNodeContent,
    SceneTreePosition,
} from '../../types'

export class SceneTree implements ISceneTree {
    _nodes: SceneNode = new Map()

    public getNodeContentAt(position: SceneTreePosition) {
        let currentTreeNode = this._nodes.get(position[0])

        for (let i = 1; i < position.length; i++) {
            currentTreeNode = currentTreeNode?.children?.get(position[i])
        }

        return currentTreeNode ?? null
    }

    public addNodeAt(
        position: SceneTreePosition | null,
        nodeContent: SceneNodeContent
    ): SceneTreePosition {
        if (!position) {
            this._nodes.set(nodeContent.gameObject.id, nodeContent)

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
        const parentPosition = targetPosition.slice(
            0,
            targetPosition.length - 1
        )

        const parentNode = this.getNodeContentAt(parentPosition)

        const childrenIds: EntityID[] = []
        this.traverseNode(parentNode?.children, (nodeId) => {
            childrenIds.push(nodeId)
        })

        parentNode?.children?.delete(targetPosition[targetPosition.length - 1])

        return childrenIds
    }

    public traverseNode(
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
        return this._nodes
    }
}
