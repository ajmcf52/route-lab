export default function MapCanvas() {
    return (
        <svg
        viewBox="0 0 750 500"
        width={750}
        height={500}
        style={{border: '1px solid gray'}}>
        
        <rect 
        x={150}
        y={150}
        width={200}
        height={100}
        fill="steelblue"/>

        <circle
        cx={550}
        cy={350}
        r={100}
        fill="red"
        />

        </svg>
    );
}