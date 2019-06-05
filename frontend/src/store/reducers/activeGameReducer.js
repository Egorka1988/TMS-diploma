import _ from 'underscore';

export const genBattleMapState = ({size, fleet, shoots, deadZone, disabled}) => {
   
    let battleMap = {}
    for (let i=1; i<size+1; i++) {
        battleMap[i] = {}
        for (let j=1; j<size+1; j++) {
            battleMap[i][j] = {isSelected: false, isHit: false, content: '', disabled: disabled}
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
                deadZone.forEach(deadCell =>{
                    const [i, j] = deadCell;
                    if (i > size || j > size) {
                        return;
                    }
                    battleMap[i][j].content = '.';  
                })
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
                // debugger;

            return {
                ...state,
                err: null,
                isLoading: false,
                creator: action.creator,
                gameId: action.id,
                size: action.size,
                name: action.name,
                joiner: action.joiner,
                turn: action.turn,
                winner: action.winner,   
                gameState: action.game_state,
                isDisabled: action.settingFleetMode ? false: action.game_state === "active" ? action.turn === action.current_user ? false : true : true,
                settingFleetMode: action.settingFleetMode,

                myShoots: action.my_shoots,
                enemyShoots: action.enemy_shoots,

                enemyBattleMap: genBattleMapState({
                    size: action.size, 
                    shoots: action.my_shoots, 
                    deadZone: action.enemy_dead_zone, 
                    disabled: action.game_state === "active" ? action.turn === action.current_user ? false : true : true,
                }),
                battleMap: genBattleMapState({
                    size: action.size, 
                    shoots: action.enemy_shoots, 
                    fleet: action.fleet, 
                    deadZone: action.my_dead_zone,
                    disabled: action.settingFleetMode ? false : true
                })
            }
   
        case 'SHOOT_RESULT_SUCCESS':
            console.log('Shoot completed')

            const [x, y] = action.lastShoot;
            let bm = {...state.enemyBattleMap};
            const shootResult = action.shootResult;
            const enemyDeadZone = action.enemyDeadZone;
            const deadShip = action.deadShip;
            let turn = state.turn;    
            let shootMsg = ''

            let newCell = {...bm[x][y]}
            if(shootResult == 'hit') {
                newCell.isHit = true;
                shootMsg = 'Hit!'
            } else if (shootResult == 'miss') {
                newCell.content = '.'
                shootMsg = 'Miss!'
                if (turn === state.creator) {
                    turn = state.joiner
                }else {
                    turn = state.creator
                }
            } else if (shootResult == 'kill') {
                newCell.isHit = true;
                newCell.content = 'x';
                shootMsg = 'Kill!'
                
                enemyDeadZone.forEach(deadCell =>{
                    const [x, y] = deadCell;
                    if (bm[x] && bm[x][y]) {
                        bm[x][y] = {...bm[x][y], content: '.'};    
                    }
                })
                deadShip.forEach(cell =>{
                    const [x, y] = cell
                    bm[x][y] = {...bm[x][y], content: 'x'}; 
                })
            }
            bm[x][y] = newCell;

            return {
                ...state,
                gameState: action.state,
                myShoots: [...state.myShoots, [x, y, shootResult]],
                enemyBattleMap: bm,
                turn: turn,
                shootMsg: shootMsg,
                err: null


            }
        case 'SHOOT_RESULT_ERROR':
            console.log('shoot results', action)
            return {
                ...state,
                err: action.err,
            }
        
        case 'GAME_STATE':
            const enemyShoots = action.enemyShoots
            let battleMap = {...state.battleMap};

            if (action.gameState === state.gameState && 
                _.isEqual(action.enemyShoots, state.enemyShoots)) {
                return state;
            }
            if (enemyShoots) {
                enemyShoots.forEach(shoot =>{
                    const [x, y, shootResult] = shoot
                    if (shootResult === "miss") {
                        battleMap[x][y] = {...battleMap[x][y], content: '.'}
                    }
                    if (shootResult === "hit") {
                        battleMap[x][y] = {...battleMap[x][y], isHit: true}
                    }
                    if (shootResult === "kill") {
                        battleMap[x][y] = {...battleMap[x][y], content: 'x', isHit: true}
                        action.myDeadZone.forEach(deadCell =>{
                            const [x, y] = deadCell;
                            if (battleMap[x] && battleMap[x][y]) {
                                battleMap[x][y] = {...battleMap[x][y], content: '.'}
                            }                            
                        })
                    }
                })
            }

            return {
                ...state,
                battleMap: {...battleMap},
                gameState: action.gameState,
                enemyShoots: action.enemyShoots,
                joiner: action.joiner,
                turn: action.turn,
                err: null,
            }
            case 'FLEET_SET':
                {
                let bm = {...action.battleMap}
                const [x, y] = action.cell
                if (bm[x] && bm[x][y]) {
                  
                    bm[x][y]={... bm[x][y], isSelected: bm[x][y].isSelected ? false :true}
                }
            return {
                ...state,
                battleMap: bm
            }
        }
        default:
            return state;
    }
}
 
export default activeGameReducer;