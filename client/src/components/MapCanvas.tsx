import type { MapData } from "../types/map";

type MapCanvasProps = {
	map: MapData;
	selectedId: string | null;
	onSelectObstacle: (id: string | null) => void;
};

export default function MapCanvas({
	map,
	selectedId,
	onSelectObstacle,
}: MapCanvasProps) {
	return (
		<svg
			viewBox={`0 0 ${map.width} ${map.height}`}
			width={map.width}
			height={map.height}
			style={{ border: "1px solid gray" }}
			onClick={() => onSelectObstacle(null)}
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
								onClick={(event) => {
									event.stopPropagation();
									onSelectObstacle(obstacle.id);
								}}
								stroke={
									selectedId === obstacle.id
										? "dodgerblue"
										: "none"
								}
								strokeWidth={3}
								cursor="pointer"
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
								onClick={(event) => {
									event.stopPropagation();
									onSelectObstacle(obstacle.id);
								}}
								stroke={
									selectedId === obstacle.id
										? "dodgerblue"
										: "none"
								}
								strokeWidth={3}
								cursor="pointer"
							/>
						);
					default:
						return <>Invalid option</>;
				}
			})}
		</svg>
	);
}
