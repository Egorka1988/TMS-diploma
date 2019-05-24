import React from 'react'

export const Cell = ({ index, isSelected, onClick, style }) => {
    return (
        <div 
            isSelected= {isSelected}
            index = {index}
            onClick={onClick}
            style={style}
            />
    );
}

const LegendCell = ({ children }) => {
    return (
        <div style={{
                textAlign: 'center',
                width: 25, 
                height: 25, 
                backgroundColor: '#ff80ab',
            }}>
            {children}
        </div>
    );
}


export const Map = ({ size, battleMap, onClick }) => {
    let bulk = []
    for (let i=0; i<size+1; i++) {
        for (let j=0; j<size+1; j++) {
            if (i == 0 && j == 0) {
                bulk.push(<LegendCell/>)
            } else if (i == 0) {
                bulk.push(<LegendCell>{(j + 9).toString(36)}</LegendCell>)
            } else if (j == 0) {
                bulk.push(<LegendCell>{i}</LegendCell>)
            } else {
                const cellData = battleMap[i] ? battleMap[i][j] || {} : {};
                bulk.push(<Cell 
                    index={[i,j]} {...cellData} 
                    onClick={onClick}
                    style={{ 
                        width: 25, 
                        height: 25, 
                        backgroundColor: `${cellData.color}` ,
                        cursor: 'pointer'
                    }} />)
            }
        }
    }
    
    return <div style={{display: 'inline-block'}}>
                <div style={{
                        display: 'grid',
                        gridTemplate:
                            `repeat(${size+1}, 25px)
                            /repeat(${size+1}, 25px)`,
                        backgroundColor: 'black',
                        gridGap: '1px',
                        border: '1px solid black'
                    }}>
                    {bulk}
                </div>
            </div>
}