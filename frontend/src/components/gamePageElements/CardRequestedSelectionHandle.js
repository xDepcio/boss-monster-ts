import Cookies from 'js-cookie'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import './CardRequestedSelectionHandle.css'


function CardRequestedSelectionHandle({ card = null }) {
    const selectedItems = useSelector(state => state.game?.selfPlayer?.requestedSelection?.selectedItems)
    const requestedSelection = useSelector(state => state.game?.selfPlayer?.requestedSelection)

    const params = useParams()

    if (!card) {
        return (<></>)
    }

    function isSelectionValid(clickedCard) {
        if (requestedSelection.requestItemType.toLowerCase() !== clickedCard.CARDTYPE.toLowerCase()) {
            return false
        }
        return true
    }

    function isSelected(clickedCard) {
        for (const item of selectedItems) {
            if (item.id === clickedCard.id) {
                return true
            }
        }
        return false
    }

    function handleSelectableCardClick() {
        fetch(`/game/${params.lobbyId}/select-item`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: Cookies.get('user'),
                itemId: card.id
            })
        })
    }


    return (
        <div onClick={handleSelectableCardClick} className={`player-item-selectable ${isSelected(card) ? 'card-item-selected' : ''} ${isSelectionValid(card) ? 'item-selection-valid' : 'item-selection-not-valid'}`}></div>
    )
}

export default CardRequestedSelectionHandle
