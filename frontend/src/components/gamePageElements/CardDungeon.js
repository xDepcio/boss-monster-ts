import { useEffect, useMemo, useState } from 'react'
import './Card.css'
import './CardDungeon.css'
import { symbolImage } from '../../static/constants'
import { getBgColor, getDungDescEm, getFontEm } from '../utils'
import { useSelector } from 'react-redux'
import HeroToMoveMarker from './HeroToMoveMarker'
import CardRequestedSelectionHandle from './CardRequestedSelectionHandle'


function CardDungeon({ width, _className, bgImage, isFancy = false, description = '', mainImg, damage = 'X', type, treasure, name = '', _onClick, fontHelp, id, card, baseDamage = 'X' }) {
    const [cardTreasureArr, setCardTreasureArr] = useState([])
    const [subHeader, setSubHeader] = useState('')
    const [typeUrl, setTypeUrl] = useState('')
    const bgUrl = useMemo(() => getBgColor(treasure), [treasure])
    const heroToMove = useSelector(state => state.game?.game.heroToMove)
    const selfPlayer = useSelector(state => state.game?.selfPlayer)
    const [enhance, setEnhance] = useState(false)

    useEffect(() => {
        switch (type) {
            case 'traps': {
                if (isFancy) {
                    setSubHeader('Wypaśna komnata pułapek')
                    // setTypeUrl('/images/dungeon_types/traps_type_enchanced.png')
                    setTypeUrl('https://previews.dropbox.com/p/thumb/ACDkB5FL9toy4slIb8itG9MAOa_tkcc7pmEFh-htBZj6-fKjPCQUE1sskaaOGenGzS4LFTKjT94W3C8WYOu4Xkp1QiUdIgeARD6kyHbLa7fbkSit5g_tVbLXMcVrssqGnDDeQf5VWZ5MOldusnJGIY2CUKl79mym5L3yIxkWErO4lCsHa6tKyqtNpJAd71JeXy6_VpDANAIBZAJ3lriLGvOHDKPQbhQXCArdrNkNmZS6_jmK0eZyDZCzKp8jn09OsVuSVKh0cJHFxz256evfWfJFJQxe_xAW5nzXSejZE-_OPrQd4JlhAPdp3uySVBh47Uu65LcbsHLSX0LHDTqwJXE6/p.png')
                }
                else {
                    setSubHeader('Komnata pułapek')
                    // setTypeUrl('/images/dungeon_types/traps_type.png')
                    setTypeUrl('https://previews.dropbox.com/p/thumb/ACBy3En0Na_MWAV1f_pJF3QTG4bLZXPMMN84JXEB1kgDWexQ6cmID0jrh9xz9ijKP3W_epdXt1NPw_xZG2ODX2K9Z0x1p8I0sDLEMGAlSdbcBlAPFLcBSiEo_vfZZ7JB_fGOdVa0aZuEW4AH3N-3cTuF1Y3n_x_uQpGBVskJogUKOEQyL7J1EyGI2vEDr5XHMuqzHASfZLO4J9GlVbcm_8nPeaWlIh79fnbC43sibLB3Ml4AP8ldXvVRXGau-_-vMXbpV6KfhZ8xrjlXhOO-3IJiP-l8pF-ESZu0prOYYr8UrhX1WGp5P5ITdFevLqSJ9tuMpSRXNMQYoA_mEjXyvY7v/p.png')
                }
                break
            }
            case 'monsters': {
                if (isFancy) {
                    setSubHeader('Wypaśna komnata potworów')
                    // setTypeUrl('/images/dungeon_types/monsters_type_enchanced.png')
                    setTypeUrl('https://previews.dropbox.com/p/thumb/ACB0fV2Ki9D-KNL8lc-i9mLZRjeNnA94ZmUKBvfyk2ydQO79ied7ayUQMbelo-pjXpWUhN75WoY1QQ1KPuf-V3qLkjeMMACLyzLfZBqZObm9XZrC9YVK5tzz9JtqyRuJVbW5zdv6q7uktfpU4qo6diLVAfXKct7KzBLMa3KvSvvVaOlzvYbF3lPzRGVOEIRHcf4LGklB77MffO3i8pFeEqgvdmVJ44QiQ7nifjYe1Is0MxZ-Bs4SSAA3nZhW2wzW64wNrFVGSjbpVgtVgVzlA7n19653SUMmWUN1OTv9wNClpjmNcjR_k4ZU1VnZkzgpRkfjU8w7PgJ2S1paT5AF1mRJ/p.png')
                }
                else {
                    setSubHeader('Komnata potworów')
                    // setTypeUrl('/images/dungeon_types/monsters_type.png')
                    setTypeUrl('https://previews.dropbox.com/p/thumb/ACC8JDJ3s9J0j1tGiCWVx9Z-oLpUMs05zn2AweQq-nGRVNXrL9BEfgtDixeSp1TGpcZaF7C_Y4TVn3En8RPqPL3fCyH47TCzYDnlQ35XsSG0MfgBpKNWvXKg3zbScKdXyqZnoQ4mdg1YUmuQ_fmnImrOlacmGBxNWdQiYGLl91xhqwuTdrdGjVdK0YbhtW7jxbzi-YaAp-zMjfZu22rdjmz5JCT-gB-PETutLIKec5v_-xLm7gARdHnrSpHLJ0gyUoDuE1bUtextqUP2UCwysIoAqnhCe4P0zxnlKXhE9dZCOiSq3KAqJt0nOgd97lTw-CTeurRtPgjxPC7VXJ8iSilv/p.png')
                }
                break
            }
            default: {
                break
            }
        }
    }, [type])

    useEffect(() => {
        if (treasure) {
            const arr = []
            for (const [symbol, amount] of Object.entries(treasure)) {
                for (let i = 0; i < amount; i++) {
                    arr.push(symbol)
                }
            }
            setCardTreasureArr(arr)
        }
    }, [treasure])

    return (
        <div onClick={_onClick}
            style={{
                width: typeof width === 'string' ? width : width + 'px',
                fontSize: typeof width === 'string' ? fontHelp : `${width / 18}px`,
                transform: enhance ? 'scale(2) translate(0%, 0%)' : '',
                zIndex: enhance ? '100' : '1',
            }}
            className={`main-card-wrapper card-comp any-card-outer-wrapper ${_className}`}
            onContextMenu={(e) => {
                e.preventDefault()
                setEnhance(!enhance)
            }}
        >
            {selfPlayer?.requestedSelection && <CardRequestedSelectionHandle card={card} />}
            {(heroToMove && heroToMove?.dungeonRoom?.id === id) && <HeroToMoveMarker />}
            <h3 style={{ fontSize: getFontEm(name.length) }} className='card-info-comp card-name dung-card-name'>{name}</h3>
            <p className='card-info-comp card-subname dungeon-card-type'>{subHeader}</p>
            <p className='card-info-comp dungeon-card-damage'
                style={{
                    color: baseDamage === damage ? 'white' : damage > baseDamage ? 'green' : 'red'
                }}
            >{damage}</p>
            <p style={{ fontSize: getDungDescEm(description?.length) }} className='card-info-comp card-comp dung-card-desc'>{description}</p>
            <img className='card-info-comp card-img-comp card-comp card-type-comp' src={typeUrl} />

            <img className='card-info-comp card-img-comp card-comp card-bg-comp' src={bgUrl || '/images/red_bg_canvas.png'} />
            <img className='card-info-comp card-img-comp card-comp card-bg-comp' src={bgUrl || '/images/red_bg_canvas.png'} />

            <img className='card-info-comp card-img-comp card-comp card-main-img-comp' src={mainImg || '/images/bosses/boss_ROBOBO.png'} />
            <img className='card-info-comp card-img-comp card-comp card-main-img-comp' src={mainImg || '/images/bosses/boss_ROBOBO.png'} />

            <img className='card-info-comp card-img-comp card-comp dungeon-card-damage-img' src={mainImg || '/images/basic/dungeon_damage_heart.png'} />
            <img className='card-info-comp card-img-comp card-comp dungeon-card-damage-img' src={mainImg || '/images/basic/dungeon_damage_heart.png'} />

            {cardTreasureArr.map((symbol, i) => {
                return (
                    <img key={i} style={{
                        transform: `translateX(-${50 * i}%)`
                    }}
                        className='card-info-comp card-img-comp card-symbol-comp' src={symbolImage[symbol]} />
                )
            })}
        </div>
    )
}

export default CardDungeon
