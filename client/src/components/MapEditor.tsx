import MapCanvas from "./MapCanvas.tsx";
import { useState } from "react";
import type { MapData } from "../types/map.ts";
import { createCircle, createRectangle } from "../utils/geometry.ts";
import Toolbar from "./Toolbar.tsx";

export default function MapEditor() {
	const [map, setMap] = useState<MapData>(() => ({
		id: crypto.randomUUID(),
		name: "Untitled",
		width: 750,
		height: 500,
		start: null,
		goal: null,
		obstacles: [],
	}));

	const [selectedId, setSelectedId] = useState<string | null>(null);

	function moveObstacle(id: string, x: number, y: number): void {
		const updatedMap = map.obstacles.map((obstacle) => {
			if (obstacle.id !== id) return obstacle;

			if (obstacle.type === "rectangle") {
				return {
					...obstacle,
					x: x,
					y: y,
				};
			} else {
				return {
					...obstacle,
					cx: x,
					cy: y,
				};
			}
		});

		setMap((previous) => ({
			...previous,
			obstacles: updatedMap,
		}));
	}

	function clearMap(): void {
		setMap((previous) => ({
			...previous,
			obstacles: [],
		}));
		setSelectedId(null);
	}

	function addCircle(): void {
		const circle = createCircle(125, 125, 125);
		setMap((previous) => ({
			...previous,
			obstacles: [...previous.obstacles, circle],
		}));
	}

	function addRectangle(): void {
		const rectangle = createRectangle(350, 250, 125, 80);
		setMap((previous) => ({
			...previous,
			obstacles: [...previous.obstacles, rectangle],
		}));
	}

	return (
		<div>
			<Toolbar
				onAddRectangle={addRectangle}
				onAddCircle={addCircle}
				onClearMap={clearMap}
			/>
			<MapCanvas
				map={map}
				selectedId={selectedId}
				onSelectObstacle={setSelectedId}
				onMoveObstacle={moveObstacle}
			/>
		</div>
	);
}
