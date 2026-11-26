import type { MapData } from "../types/map";
import type { Obstacle, Point } from "../types/geometry";
import { useRef } from "react";
import type { PointerEvent } from "react";

type MapCanvasProps = {
	map: MapData;
	selectedId: string | null;
	onSelectObstacle: (id: string | null) => void;
	onMoveObstacle: (id: string, x: number, y: number) => void;
};

type DragState = {
	obstacleId: string;
	offsetX: number;
	offsetY: number;
};

export default function MapCanvas({
	map,
	selectedId,
	onSelectObstacle,
	onMoveObstacle,
}: MapCanvasProps) {
	const svgRef = useRef<SVGSVGElement>(null);

	const dragRef = useRef<DragState | null>(null);

	function toMapCoordinates(mouseX: number, mouseY: number): Point | null {
		if (svgRef.current === null) return null;

		const mat = svgRef.current.getScreenCTM();
		if (mat === null) return null;

		const pt = svgRef.current.createSVGPoint();
		pt.x = mouseX;
		pt.y = mouseY;

		return pt.matrixTransform(mat.inverse());
	}

	function handlePointerDown(
		evt: PointerEvent<SVGElement>,
		obstacle: Obstacle,
	): void {
		const svgPt = toMapCoordinates(evt.clientX, evt.clientY);

		if (svgPt === null) return;

		let oX, oY;
		if (obstacle.type === "circle") {
			oX = obstacle.cx;
			oY = obstacle.cy;
		} else {
			oX = obstacle.x;
			oY = obstacle.y;
		}

		dragRef.current = {
			offsetX: svgPt.x - oX,
			offsetY: svgPt.y - oY,
			obstacleId: obstacle.id,
		};

		onSelectObstacle(obstacle.id);

		console.log(dragRef.current);
	}

	function handlePointerMove(evt: PointerEvent<SVGElement>): void {
		if (dragRef.current === null) return;

		const svgPt = toMapCoordinates(evt.clientX, evt.clientY);

		if (svgPt === null) return;
		const newPos = {
			x: svgPt.x - dragRef.current.offsetX,
			y: svgPt.y - dragRef.current.offsetY,
		};

		onMoveObstacle(dragRef.current.obstacleId, newPos.x, newPos.y);
	}

	return (
		<svg
			ref={svgRef}
			viewBox={`0 0 ${map.width} ${map.height}`}
			width={map.width}
			height={map.height}
			style={{ border: "1px solid gray" }}
			onClick={() => onSelectObstacle(null)}
			onPointerDown={(evt) => {
				const pt = toMapCoordinates(evt.clientX, evt.clientY);

				console.log(pt);
			}}
			onPointerMove={handlePointerMove}
			onPointerUp={() => {
				dragRef.current = null;
			}}
			onPointerCancel={() => {
				dragRef.current = null;
			}}
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
								onPointerDown={(event) =>
									handlePointerDown(event, obstacle)
								}
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
								onPointerDown={(event) =>
									handlePointerDown(event, obstacle)
								}
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
