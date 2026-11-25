type ToolbarProps = {
	onAddRectangle: () => void;
	onAddCircle: () => void;
	onClearMap: () => void;
};

export default function Toolbar(props: ToolbarProps) {
	return (
		<div>
			<button onClick={props.onAddRectangle}>Add Rectangle</button>
			<button onClick={props.onAddCircle}>Add Circle</button>
			<button onClick={props.onClearMap}>Clear Map</button>
		</div>
	);
}
