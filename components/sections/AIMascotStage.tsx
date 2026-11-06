'use client'

const mascots = [
    {
        name: 'claude', code: '</>', color: '#ed8969', accent: '#ffb08a', shadow: '#a9584b', delay: '0s', path: 'mascot-path-one',
        pixels: ['....AAA....AAA...', '...AACCA..AACCA..', '...ACCCCAACCCCA..', '..AACCCCCCCCCC...', '.AACCCCCCCCCCCC..', 'AACCCCECCCCECCCCA', 'AACCCCCCCCCCCCCC.', '.AACCCCCCCCCCCCA.', '..AACCCCCCCCCCA..', '...MMCCCCCCMM....', '..MM..CC..MM......', '.MM...CC...MM.....'],
    },
    {
        name: 'robot', code: '010', color: '#62cbb0', accent: '#d6fff3', shadow: '#328c79', delay: '-3s', path: 'mascot-path-two',
        pixels: ['.......A........', '.......A........', '......AAA.......', '...OOOOOOOOOO...', '..OCCCCCCCCCCO..', '.OCCCCCCCCCCCCO.', '.OCCCECCCCECCCCO.', '.OCCCCCCCCCCCCO.', '..OCCCAAAACCCO..', '...OOOOOOOOOO...', '.....CC..CC......', '.....CC..CC......'],
    },
    {
        name: 'laptop', code: '{ }', color: '#9d91fa', accent: '#e8e3ff', shadow: '#6860ad', delay: '-6s', path: 'mascot-path-three',
        pixels: ['................', '..OOOOOOOOOOOO..', '..OCCCCCCCCCCO..', '..OCCCECCCECCO..', '..OCCCCCCCCCCO..', '..OCCCAACCCCCO..', '..OOOOOOOOOOOO..', '.OOOOOOOOOOOOOO.', 'OOOMOMOMOMOMOOOO', '.OO............'],
    },
    {
        name: 'android', code: 'AI', color: '#edc65f', accent: '#fff2bd', shadow: '#ad8738', delay: '-2s', path: 'mascot-path-four',
        pixels: ['...A......A...', '..AA......AA..', '....OOOO....', '..OOCCCCOO..', '.OCCCCCCCCO.', 'OCCCECCCCECCCCO', 'OCCCCCCCCCCCCO', '.OCCCMCCMCCO.', '..OOCCCCOO..', '....O..O.....', '....O..O.....'],
    },
    {
        name: 'spark', code: '*', color: '#ed85a8', accent: '#ffe1ec', shadow: '#b44f75', delay: '-8s', path: 'mascot-path-five',
        pixels: ['.......A........', '......AAA.......', '...A..CCC..A....', '....CCCCCCC.....', '..CCCCCCCCCCC...', '.CCCCCECCCCCCC..', 'CCCCCCCCCCCCCCC.', '.CCCCCCCCCCCCC..', '..CCCCCCCCCCC...', '....CCCCCCC......', '.....CC.CC........'],
    },
]

function Mascot({ mascot, index }: { mascot: (typeof mascots)[number]; index: number }) {
    return (
        <div className={`ai-mascot ${mascot.path}`} style={{ animationDelay: mascot.delay }}>
            <span className="ai-mascot-bubble" style={{ animationDelay: `${index * -0.7}s` }}>{mascot.code}</span>
            <svg className="ai-mascot-body" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
                {mascot.pixels.flatMap((row, y) => [...row].map((pixel, x) => {
                    if (pixel === '.' || pixel === ' ') return null
                    const fill = pixel === 'O' ? '#24232a' : pixel === 'E' ? '#211d1e' : pixel === 'A' ? mascot.accent : pixel === 'M' ? mascot.shadow : mascot.color
                    return <rect key={`${x}-${y}`} x={x * 10} y={y * 10} width="10" height="10" fill={fill} />
                }))}
            </svg>
            <span className="ai-mascot-sparkle">✦</span>
        </div>
    )
}

export default function AIMascotStage() {
    return (
        <div className="ai-mascot-stage">
            {mascots.map((mascot, index) => <Mascot key={mascot.name} mascot={mascot} index={index} />)}
            <span className="ai-mascot-orbit ai-mascot-orbit-one" />
            <span className="ai-mascot-orbit ai-mascot-orbit-two" />
            <span className="ai-mascot-orbit ai-mascot-orbit-three" />
        </div>
    )
}
