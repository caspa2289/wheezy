import {
    IGameObject,
    ISceneTree,
    SceneNode,
    SceneTreePosition,
} from '../../types'

export class SceneTree implements ISceneTree {
    _nodes: SceneNode[] = []

    addNodeAt(
        position: SceneTreePosition | null,
        node: SceneNode
    ): SceneTreePosition {
        if (!position) {
            this._nodes = [...this._nodes, node]

            return [] as SceneTreePosition
        }

        let currentTreeNode = this._nodes[position[0]]

        for (let i = 1; i < position.length; i++) {
            currentTreeNode = currentTreeNode[1][position[i]]
        }

        currentTreeNode[1] = [...currentTreeNode[1], node]

        return [...position, currentTreeNode.length]
    }

    public addNodeAsChild(parent: IGameObject, child: IGameObject) {
        const parentPosition = parent.sceneTreePosition
        const childNode = [child.id, []] as SceneNode

        this.addNodeAt(parentPosition, childNode)
    }

    //FIXME: child should be a node probable
    public reparentNode(target: IGameObject, child: IGameObject) {
        //FIXME: take into account that child node could have children already
    }

    //FIXME: maybe return an array of ids to remove for object manager here
    public removeNode(object: IGameObject) {}

    get nodes() {
        return this._nodes
    }
}
