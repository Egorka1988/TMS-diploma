import React from 'react'

export const Cell = ({ index, isSelected, onClick, disabled, style, isError }) => {
    
    return (
        <div 
            onClick={() => !disabled && onClick(index)}
            style={{ 
                width: '25px',
                height: '25px',
                cursor: disabled ? 'inherit' : 'pointer',
                backgroundColor: isError? 'red' : isSelected ? 'lime' : 'white',
                ...style
            }} 
        />
    );
}

const LegendCell = ({ children }) => {
    return (
        <div
            // className='legendCell' 
            style={{
                width: '25px',
                height: '25px',
                textAlign: 'center',
                backgroundColor: '#ff80ab',
            }}
        >
            {children}
        </div>
    );
}


export const Map = ({ size, battleMap, onClick, isError }) => {
    let bulk = []
    for (let i=0; i<size+1; i++) {
        for (let j=0; j<size+1; j++) {
            if (i == 0 && j == 0) {
                bulk.push(<LegendCell key='rootCell'/>)
            } else if (i == 0) {
                bulk.push(<LegendCell key={[i,j]}>{(j + 9).toString(36)}</LegendCell>)
            } else if (j == 0) {
                bulk.push(<LegendCell key={[i,j]}>{i}</LegendCell>)
            } else {
                const cellData = battleMap[i] ? battleMap[i][j] || {} : {};
                bulk.push(<Cell 
                    key={'cell_' + [i,j]}
                    index={[i,j]} 
                    onClick={onClick}
                    isSelected={cellData.isSelected}
                    isError={cellData.isError}
                />)
            }
        }
    }
    
    return <div style={{display: 'inline-block'}}>
                <div
                    // className = 'battleGrid' 
                    // style={setProperty('--size', {{size}+1})}
                    style={{
                        display: 'grid',
                        gridTemplate:
                            `repeat(${size+1}, 25px)
                            /repeat(${size+1}, 25px)`,
                        backgroundColor: 'black',
                        gridGap: '1px',
                        border: '1px solid black'
                    }}
                >
                    {bulk}
                </div>
            </div>
}