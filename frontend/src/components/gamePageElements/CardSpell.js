import './CardSpell.css'
import { phaseImage } from '../../static/constants'
import { getSpellDescDontEm, getSpellNameEm } from '../utils'
import CardRequestedSelectionHandle from './CardRequestedSelectionHandle'
import { useSelector } from 'react-redux'
import { BACKEND_URL } from "../../static/constants"


function CardSpell({ width, _className, description = '', mainImg, phase, name = '', _onClick, fontHelp, card }) {
    const selfPlayer = useSelector(state => state.game.selfPlayer)

    return (
        <div onClick={_onClick} style={{ width: typeof width === 'string' ? width : width + 'px', fontSize: typeof width === 'string' ? fontHelp : `${width / 18}px` }} className={`main-card-wrapper card-comp ${_className}`}>
            {selfPlayer?.requestedSelection && <CardRequestedSelectionHandle card={card} />}
            <h3 className='card-info-comp card-name spell-card-name ' style={{ fontSize: getSpellNameEm(name.length) }}>{name}</h3>
            <p style={{ fontSize: getSpellDescDontEm(description.length) }} className='card-info-comp card-comp spell-card-desc'>{description}</p>
            <img className='card-info-comp card-img-comp card-comp card-bg-comp' src={`${BACKEND_URL}/images/cards_bgs/bg_spell.png`} />
            <img className='card-info-comp card-img-comp card-comp card-main-img-comp' src={mainImg || `${BACKEND_URL}/images/spells/spell_exhaustion.png`} />
            <img className='card-info-comp card-img-comp card-comp spell-card-phase-img' src={phaseImage[phase]} />
        </div>
    )
}

export default CardSpell
