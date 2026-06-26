import * as d3 from 'd3';

const width = 0;
const height = 0;

interface NodeData {
  name: string;
  value?: number;
  children?: NodeData[];
}

const data = [{village: "A", count: 10}, {village: "B", count: 20}];

const rootNode: NodeData = {
  name: 'root',
  children: data.map(d => ({ name: d.village, value: d.count }))
};

const root = d3.hierarchy<NodeData>(rootNode).sum(d => d.value || 0);

const pack = d3.pack<NodeData>()
  .size([width, height])
  .padding(3);

try {
  const nodes = pack(root).leaves();
  console.log("Success", nodes.length);
} catch (e) {
  console.log("Error", e.message);
}
