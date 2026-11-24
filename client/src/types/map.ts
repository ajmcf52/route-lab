import type {Point, Obstacle} from './geometry.ts'

export type MapData = {
    id: string;
    name: string;
    width: number;
    height: number;
    start: Point | null;
    goal: Point | null;
    obstacles: Obstacle[];
}


