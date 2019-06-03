export const genBattleMapState = ({size, fleet, shoots}) => {
    console.log('bla')
   
    let battleMap = {}
    for (let i=1; i<size+1; i++) {
        battleMap[i] = {}
        for (let j=1; j<size+1; j++) {
            battleMap[i][j] = {isSelected: false, isHit: false, content: ''}
        }
    }

    if (fleet) {
        fleet.forEach(ship => {
            ship.forEach(index => {
                const [x, y] = index;
                battleMap[x][y].isSelected = true;
            })
        })
    }
    if (shoots) {
        shoots.forEach(index => {
            const [x, y, state] = index;
            let cell = battleMap[x][y];
            if (state == 'hit') {
                cell.isHit = true;
            } else if (state == 'kill') {
                cell.isHit = true;
                cell.content = 'x'
            } else if (state == 'miss') {
                cell.content = '.'
            }
        })
    }

    return battleMap
}


const initState = {
    err: null,
    isLoading: true
}

const activeGameReducer = (state = initState, action) => {
    

    switch(action.type){

        case 'LOAD_ACTIVE_GAME':
    
            return {
                ...state,
                isLoading: false,
                creator: action.creator,
                gameId: action.id,
                size: action.size,
                name: action.name,
                joiner: action.joiner,
                turn: action.turn,
                winner: action.winner,   
                gameState: action.game_state,

                myShoots: action.my_shoots,
                enemyShoots: action.enemy_shoots,

                enemyBattleMap: genBattleMapState({size: action.size, shoots: action.my_shoots}),
                battleMap: genBattleMapState({size: action.size, shoots: action.enemy_shoots, fleet: action.fleet})
            }
   
        case 'SHOOT_RESULT_SUCCESS':
            console.log('Shoot completed')

            const [x, y] = action.lastShoot;
            const bm = state.enemyBattleMap;
            const shootResult = action.shootResult;

            let newCell = {...bm[x][y]}
            if(shootResult == 'hit') {
                newCell.isHit = true;
            } else if (shootResult == 'miss') {
                newCell.content = '.'
            } else if (shootResult == 'kill') {
                newCell.isHit = true;
                newCell.content = 'x';
            }

            return {
                ...state,
                gameState: action.state,
                myShoots: [...state.myShoots, [x, y, shootResult]],
                enemyBattleMap: {...bm, [x]: {...bm[x], [y]: newCell}}

            }
        case 'SHOOT_RESULT_ERROR':
            console.log('shoot results', action)

            return {
                ...state,
                err: action.err,
            }
        
        case 'GAME_STATE':

            return {
                ...state,
                // my map
            }
        default:
            return state;

    }
}
 
export default activeGameReducer;