import { GameEvent, feedback } from "../actionFeedbacks"
import { BossCard, DungeonCard } from "../cards"
import { SelectionRequest, SelectionRequestNEW, SelectionRequestUniversal } from "../playerRequestSelections"
import { CardAction } from "./customCardActions"
import { RoundModifer } from "./roundModifiers"

// const { eventTypes, feedback } = require("../actionFeedbacks")
const GAME_CONSTANTS = require('../gameConstants.json')
// const { CardAction } = require("./customCardActions")
// const { RoundModifer } = require("./roundModifiers")

class BossMechanic {

    bossCard: BossCard
    mechanicDescription: string

    constructor(bossCard: BossCard, mechanicDescription: string) {
        this.bossCard = bossCard
        this.mechanicDescription = mechanicDescription
    }

    getDescription() {
        return this.mechanicDescription
    }

    validate(): boolean {
        if (!this.bossCard.owner) return false

        if (!this.bossCard.hasRankedUp()) {
            if (this.bossCard.owner.dungeon.length >= GAME_CONSTANTS.dungeonsCountToRankUp) {
                this.bossCard.setRankedUp(true)
                return false
            }
            return false
        }
        return true
    }

    handleGameEvent(event: GameEvent): any {
    }
}

class GainOneGoldEveryTimeMonsterDungeonIsBuild extends BossMechanic {
    constructor(bossCard, mechanicDescription) {
        super(bossCard, mechanicDescription)
    }

    use() {
        this.bossCard.owner.addGold(1)
        this.bossCard.trackedGame.saveGameAction(feedback.PLAYER_USED_BOSS_RANKUP_MECHANIC(this.bossCard.owner, this.bossCard, this))
    }

    handleGameEvent(event: GameEvent) {
        if (!super.validate()) return
        // if (!super.handleGameEvent(event)) return

        if (event.type === "PLAYER_BUILD_DUNGEON") {
            if (this.bossCard.owner.id === event.player.id && event.dungeon.type === "monsters") {
                this.use()
            }
        }
    }
}

class BoostEveryTrapDungeonFor1EnemiesCanPay1GoldToDeactivate extends BossMechanic {

    appliedModifer: RoundModifer
    disabled: boolean
    addedCardAction: CardAction

    constructor(bossCard: BossCard, mechanicDescription: string) {
        super(bossCard, mechanicDescription)
        this.appliedModifer = null
        this.addedCardAction = null
        this.disabled = false
    }

    handleRankUp() {
        const cardAction = new CardAction(
            "Zapłać 1 gold",
            [...this.bossCard.trackedGame.players].filter(player => player.id !== this.bossCard.owner.id),
            (playerThatUsed) => {
                this.bossCard.trackedGame.saveGameAction(feedback.PLAYER_USED_CUSTOM_CARD_ACTION(this.bossCard.owner, this.bossCard, "Zapłać 1 gold"))
                playerThatUsed.payGold(1, this.bossCard.owner)
                this.disableForRound()
            }
        )
        this.addedCardAction = cardAction
        this.bossCard.addCustomCardAction(cardAction)
    }

    disableForRound() {
        this.addedCardAction.setActionDisabled(true)
        this.appliedModifer.endManually()
        this.disabled = true
    }

    applyModifier() {
        const existingCards = [...this.bossCard.owner.dungeon]
        const modifer = new RoundModifer(
            () => {
                this.addedCardAction.setActionDisabled(false)
                existingCards.forEach((dungeonCard) => {
                    if (dungeonCard.type === "traps") {
                        dungeonCard.damage += 1
                    }
                })
            },
            () => {
                existingCards.forEach((dungeonCard) => {
                    if (dungeonCard.type === "traps") {
                        dungeonCard.damage -= 1
                    }
                })
                this.appliedModifer = null
            },
        )

        this.appliedModifer = modifer
        this.bossCard.trackedGame.addRoundModifier(modifer)
    }

    reApplayModifier() {
        if (this.appliedModifer) {
            this.appliedModifer.endManually()
        }
        this.applyModifier()
    }

    handleGameEvent(event: GameEvent) {
        if (!super.validate()) return

        if (event.type === "PLAYER_RANKED_UP_BOSS" && event.player.id === this.bossCard.owner.id) {
            this.handleRankUp()
        }

        if (event.type === "NEW_ROUND_BEGUN") {
            this.disabled = false
        }

        if (!this.disabled) {
            this.reApplayModifier()
        }
    }
}

class MakeEveryOpponentDestroyOneDungeon extends BossMechanic {

    constructor(bossCard: BossCard, mechanicDescription: string) {
        super(bossCard, mechanicDescription)
    }

    handleRankUp() {
        const targetPlayers = [...this.bossCard.trackedGame.players].filter(player => player.id !== this.bossCard.owner.id)
        targetPlayers.forEach((player) => {
            if (player.dungeon.length === 0) return

            const selection = new SelectionRequestNEW({
                amount: 1,
                choiceScope: player,
                requestedPlayer: player,
                requestItemType: "builtDungeon",
                onFinish: (items) => {
                    items.forEach((dungeonCard: DungeonCard) => {
                        dungeonCard.setAllowDestroy(true)
                        player.destroyDungeonCard(dungeonCard.id)
                    })
                },
                message: "Wybierz swój loch do znieszczenia."
            })
            player.setRequestedSelection(selection);
        })
        this.bossCard.trackedGame.saveGameAction(feedback.PLAYER_USED_BOSS_RANKUP_MECHANIC(this.bossCard.owner, this.bossCard, this))
    }

    handleGameEvent(event: GameEvent) {
        if (!super.validate()) return

        if (event.type === "PLAYER_RANKED_UP_BOSS" && event.player.id === this.bossCard.owner.id) {
            this.handleRankUp()
        }
    }
}

class DrawFancyDungeonFromDiscardedOrDeck extends BossMechanic {

    constructor(bossCard: BossCard, mechanicDescription: string) {
        super(bossCard, mechanicDescription)
    }

    handleRankUp() {
        new SelectionRequestUniversal<DungeonCard>({
            amount: 1,
            requestedPlayer: this.bossCard.owner,
            avalibleItemsForSelectArr: [
                ...this.bossCard.trackedGame.notUsedDungeonCardsStack,
                ...this.bossCard.trackedGame.usedCardsStack.filter(card => card instanceof DungeonCard) as DungeonCard[]
            ],
            metadata: {
                displayType: 'dungeonCard',
            },
            selectionMessage: "Wybierz loch do dodania do ręki.",
            onFinish: (items) => {
                if (this.bossCard.trackedGame.notUsedDungeonCardsStack.includes(items[0])) {
                    this.bossCard.owner.drawSpecificDungeonCard(items[0].id)
                } else {
                    this.bossCard.owner.drawDungeonFromUsedCardsStack(items[0].id)
                }

                const avalibleToBuildOn = this.bossCard.owner.dungeon.filter((dungeonCard, index) => {
                    try {
                        return this.bossCard.owner.checkIfDungeonBuildValid(items[0], index, { ignoreRoundPhase: true })
                    } catch (err) {
                        return false
                    }
                })
                if (avalibleToBuildOn.length > 0) {
                    new SelectionRequestUniversal({
                        amount: 1,
                        avalibleItemsForSelectArr: avalibleToBuildOn,
                        metadata: {
                            displayType: 'dungeonCard',
                        },
                        requestedPlayer: this.bossCard.owner,
                        selectionMessage: "Wybierz gdzie wybudować loch.",
                        onFinish: ([toBuildOn]) => {
                            this.bossCard.owner.declareBuild(items[0], this.bossCard.owner.dungeon.indexOf(toBuildOn), { ignoreRoundPhase: true })
                            this.bossCard.owner.buildDeclaredDungeon()
                        }
                    })
                }
            },
            additonalValidation: (item) => item.isFancy,
        })
        this.bossCard.trackedGame.saveGameAction(feedback.PLAYER_USED_BOSS_RANKUP_MECHANIC(this.bossCard.owner, this.bossCard, this))
    }

    handleGameEvent(event: GameEvent) {
        if (!super.validate()) return

        if (event.type === "PLAYER_RANKED_UP_BOSS" && event.player.id === this.bossCard.owner.id) {
            this.handleRankUp()
        }
    }
}

const bossesMechanicsMap = {
    'Lamia': GainOneGoldEveryTimeMonsterDungeonIsBuild,
    'Scott': BoostEveryTrapDungeonFor1EnemiesCanPay1GoldToDeactivate,
    'ROBOBO': MakeEveryOpponentDestroyOneDungeon,
    'KRÓL ROPUCH': DrawFancyDungeonFromDiscardedOrDeck,
}

module.exports = {
    bossesMechanicsMap
}

export { BossMechanic }
