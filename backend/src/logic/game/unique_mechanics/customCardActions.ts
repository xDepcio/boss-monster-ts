import { Player } from "../../player/player"
import { Id } from "../../types"

const { v4 } = require("uuid")

class CardAction {
    static cardActions: { [id: Id]: CardAction } = {}

    title: string
    allowUseFor: Player[]
    onUse: (player: Player) => void
    actionDisabled: boolean
    id: Id

    constructor({ title, allowUseFor, onUse }: { title: string, allowUseFor: Player[], onUse: (player: Player) => void }) {
        this.title = title
        this.allowUseFor = allowUseFor // Array of all players allowed to use this
        this.onUse = onUse
        this.actionDisabled = false
        this.id = v4()
        CardAction.cardActions[this.id] = this

    }

    setActionDisabled(bool: boolean) {
        this.actionDisabled = bool
    }

    canPlayerUse(player: Player) {
        if (this.actionDisabled) return false

        for (let allowedPlayer of this.allowUseFor) {
            if (player.id === allowedPlayer.id) {
                return true
            }
        }
        return false
    }

    handleUsedByPlayer(player: Player) {
        if (this.canPlayerUse(player)) {
            this.onUse(player)
        }
    }

    static getCardActionById(id: string | number) {
        return CardAction.cardActions[id]
    }
}


module.exports = {
    CardAction
}

export { CardAction }
