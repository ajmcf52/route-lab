import type { MapData } from "../types/map";
import type { Obstacle, Point, ResizeDimensions } from "../types/geometry";
import { useRef } from "react";
import type { PointerEvent } from "react";

type MapCanvasProps = {
	map: MapData;
	selectedId: string | null;
	onSelectObstacle: (id: string | null) => void;
	onMoveObstacle: (id: string, x: number, y: number) => void;
	onResizeObstacle: (id: string, dimensions: ResizeDimensions) => void;
};

type DragState = {
	obstacleId: string;
	offsetX: number;
	offsetY: number;
};

type ResizeState = {
	obstacleId: string;
	offsetX: number;
	offsetY: number;
};

export default function MapCanvas({
	map,
	selectedId,
	onSelectObstacle,
	onMoveObstacle,
	onResizeObstacle,
}: MapCanvasProps) {
	const svgRef = useRef<SVGSVGElement>(null);

	const dragRef = useRef<DragState | null>(null);

	const resizeRef = useRef<ResizeState | null>(null);

	function toMapCoordinates(mouseX: number, mouseY: number): Point | null {
		if (svgRef.current === null) return null;

		const mat = svgRef.current.getScreenCTM();
		if (mat === null) return null;

		const pt = svgRef.current.createSVGPoint();
		pt.x = mouseX;
		pt.y = mouseY;

		return pt.matrixTransform(mat.inverse());
	}

	function endInteraction(): void {
		dragRef.current = null;
		resizeRef.current = null;
	}

	function handlePointerDown(
		evt: PointerEvent<SVGElement>,
		obstacle: Obstacle,
	): void {
		evt.stopPropagation();

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

		if (svgRef.current === null) return;
		svgRef.current.setPointerCapture(evt.pointerId);
	}

	function handlePointerMove(evt: PointerEvent<SVGElement>): void {
		if (dragRef.current === null && resizeRef.current === null) return;

		const svgPt = toMapCoordinates(evt.clientX, evt.clientY);

		if (svgPt === null) return;

		if (dragRef.current !== null) {
			const newPos = {
				x: svgPt.x - dragRef.current.offsetX,
				y: svgPt.y - dragRef.current.offsetY,
			};

			onMoveObstacle(dragRef.current.obstacleId, newPos.x, newPos.y);
		} else if (resizeRef.current !== null) {
			const resize = resizeRef.current;
			const obstacle = map.obstacles.find(
				(o) => o.id === resize.obstacleId,
			);

			if (obstacle === undefined) return;

			const newPos = {
				x: svgPt.x - resize.offsetX,
				y: svgPt.y - resize.offsetY,
			};

			if (obstacle.type === "rectangle") {
				onResizeObstacle(obstacle.id, {
					type: "rectangle",
					width: Math.max(10, newPos.x - obstacle.x),
					height: Math.max(10, newPos.y - obstacle.y),
				});
			} else {
				onResizeObstacle(obstacle.id, {
					type: "circle",
					radius: Math.max(10, newPos.x - obstacle.cx),
				});
			}
		}
	}

	function handleResizeStart(
		evt: PointerEvent<SVGElement>,
		obstacle: Obstacle,
	): void {
		evt.stopPropagation();

		const svgPt = toMapCoordinates(evt.clientX, evt.clientY);

		if (svgPt === null || svgRef.current === null) return;

		const resizeCtr =
			obstacle.type === "rectangle"
				? {
						x: obstacle.x + obstacle.width,
						y: obstacle.y + obstacle.height,
					}
				: {
						x: obstacle.cx + obstacle.radius,
						y: obstacle.cy,
					};

		const ptOffset = {
			x: svgPt.x - resizeCtr.x,
			y: svgPt.y - resizeCtr.y,
		};

		resizeRef.current = {
			obstacleId: obstacle.id,
			offsetX: ptOffset.x,
			offsetY: ptOffset.y,
		};

		svgRef.current.setPointerCapture(evt.pointerId);

		console.log(resizeRef.current);
	}

	return (
		<svg
			ref={svgRef}
			viewBox={`0 0 ${map.width} ${map.height}`}
			width={map.width}
			height={map.height}
			style={{ border: "1px solid gray" }}
			onPointerDown={() => {
				onSelectObstacle(null);
			}}
			onPointerMove={handlePointerMove}
			onPointerUp={endInteraction}
			onPointerCancel={endInteraction}
			onLostPointerCapture={endInteraction}
		>
			{map.obstacles.map((obstacle) => {
				switch (obstacle.type) {
					case "circle":
						return (
							<g key={obstacle.id}>
								<circle
									r={obstacle.radius}
									cx={obstacle.cx}
									cy={obstacle.cy}
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

								{obstacle.id === selectedId && (
									<rect
										x={obstacle.cx + obstacle.radius - 4}
										y={obstacle.cy - 4}
										width={8}
										height={8}
										fill="white"
										stroke="dodgerblue"
										cursor="ew-resize"
										onPointerDown={(evt) =>
											handleResizeStart(evt, obstacle)
										}
									/>
								)}
							</g>
						);
					case "rectangle":
						return (
							<g key={obstacle.id}>
								<rect
									x={obstacle.x}
									y={obstacle.y}
									width={obstacle.width}
									height={obstacle.height}
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

								{selectedId === obstacle.id && (
									<rect
										x={obstacle.x + obstacle.width - 4}
										y={obstacle.y + obstacle.height - 4}
										width={8}
										height={8}
										fill="white"
										stroke="dodgerblue"
										cursor="nwse-resize"
										onPointerDown={(evt) =>
											handleResizeStart(evt, obstacle)
										}
									/>
								)}
							</g>
						);
					default:
						return <>Invalid option</>;
				}
			})}
		</svg>
	);
}
