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

	function clearMap(): void {
		setMap((previous) => ({
			...previous,
			obstacles: [],
		}));
	}

	function addCircle(): void {
		const circle = createCircle(125, 125, 125);
		setMap((previous) => ({
			...previous,
			obstacles: [...previous.obstacles, circle],
		}));
	}

	function addRectangle(): void {
		const rectangle = createRectangle(100, 100, 125, 80);
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
			<MapCanvas map={map} />
		</div>
	);
}
