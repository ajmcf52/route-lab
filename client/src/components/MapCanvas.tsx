import type { MapData } from "../types/map";

type MapCanvasProps = {
	map: MapData;
};

export default function MapCanvas({ map }: MapCanvasProps) {
	return (
		<svg
			viewBox={`0 0 ${map.width} ${map.height}`}
			width={map.width}
			height={map.height}
			style={{ border: "1px solid gray" }}
		>
			{map.obstacles.map((obstacle) => {
				switch (obstacle.type) {
					case "circle":
						return (
							<circle
								r={obstacle.radius}
								cx={obstacle.cx}
								cy={obstacle.cy}
								key={obstacle.id}
							/>
						);
					case "rectangle":
						return (
							<rect
								x={obstacle.x}
								y={obstacle.y}
								width={obstacle.width}
								height={obstacle.height}
								key={obstacle.id}
							/>
						);
					default:
						return <>Invalid option</>;
				}
			})}
		</svg>
	);
}
