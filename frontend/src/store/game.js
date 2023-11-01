import Cookies from 'js-cookie'
import { stringify, parse, fromJSON, toJSON } from 'flatted'
import { backendUrlBase } from '../constants'


const LOAD_GAME_INFO = 'loadGameInfo'
const LOAD_ERROR_MESSAGE = 'loadErrorMessage'


// Normal actions creator
export const loadGameInfo = (gameData) => {
    gameData = parse(gameData)
    return {
        type: LOAD_GAME_INFO,
        gameData
    }
}

export const loadErrorMessage = (errorMessage) => {
    return {
        type: LOAD_ERROR_MESSAGE,
        errorMessage
    }
}


// Thunk actions creator
export const getGameInfo = (lobbyId) => async (dispatch) => {
    // const response = await fetch(`/game/${lobbyId}`)
    const response = await fetch(`${backendUrlBase}/game/${lobbyId}`)

    if (response.ok) {
        const gameData = await response.text()
        // const parsedGameData = parse(gameData)

        // const gameData = await response.json()
        // const test = stringify(gameData)
        // console.log(test)

        // const parsed = parse(test)
        // console.log(parsed)
        dispatch(loadGameInfo(gameData))
    }
}

// Reducer
const gameReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_GAME_INFO: {
            const newState = { ...state }
            newState.game = action.gameData.game
            newState.players = action.gameData.players
            const selfId = Cookies.get('user')
            const selfPlayer = action.gameData.players.find(player => player.id === selfId)
            newState.selfPlayer = selfPlayer
            return newState
        }
        case LOAD_ERROR_MESSAGE: {
            const newState = { ...state }
            newState.userError = action.errorMessage
            return newState
        }
        default: {
            return state
        }
    }
}

export default gameReducer
