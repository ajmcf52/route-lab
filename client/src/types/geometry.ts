export type Point = {
	x: number;
	y: number;
};

export type Rectangle = {
	id: string;
	type: "rectangle";
	x: number;
	y: number;
	width: number;
	height: number;
};

export type Circle = {
	id: string;
	type: "circle";
	cx: number;
	cy: number;
	radius: number;
};

export type ResizeDimensions =
	| { type: "rectangle"; width: number; height: number }
	| { type: "circle"; radius: number };

export type Obstacle = Rectangle | Circle;
