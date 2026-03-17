export interface PathDefinition {
  d: string;
  id?: string;
}

export interface ShapePreset {
  name: string;
  paths: PathDefinition[];
  viewBox: string;
}

export const TELEMETRY_PRESETS: Record<string, ShapePreset> = {
  network: {
    name: "network",
    viewBox: "0 0 200 200",
    paths: [
      // Cardinal directions
      { d: "M 100,100 L 100,30", id: "n-top" },
      { d: "M 100,100 L 170,100", id: "n-right" },
      { d: "M 100,100 L 100,170", id: "n-bottom" },
      { d: "M 100,100 L 30,100", id: "n-left" },
      // Diagonals
      { d: "M 100,100 L 150,50", id: "n-tr" },
      { d: "M 100,100 L 150,150", id: "n-br" },
      { d: "M 100,100 L 50,150", id: "n-bl" },
      { d: "M 100,100 L 50,50", id: "n-tl" },
    ],
  },

  tree: {
    name: "tree",
    viewBox: "0 0 200 200",
    paths: [
      // Root to trunk
      { d: "M 100,180 L 100,100", id: "trunk" },
      // Main branches
      { d: "M 100,100 L 55,55", id: "branch-l1" },
      { d: "M 100,100 L 145,55", id: "branch-r1" },
      // Sub-branches left
      { d: "M 55,55 L 30,25", id: "branch-l2" },
      { d: "M 55,55 L 70,25", id: "branch-l3" },
      // Sub-branches right
      { d: "M 145,55 L 130,25", id: "branch-r2" },
      { d: "M 145,55 L 170,25", id: "branch-r3" },
    ],
  },

  circuit: {
    name: "circuit",
    viewBox: "0 0 200 200",
    paths: [
      // Horizontal bus lines
      { d: "M 25,50 L 175,50", id: "h1" },
      { d: "M 25,100 L 175,100", id: "h2" },
      { d: "M 25,150 L 175,150", id: "h3" },
      // Vertical connectors
      { d: "M 60,50 L 60,100", id: "v1" },
      { d: "M 100,50 L 100,150", id: "v2" },
      { d: "M 140,100 L 140,150", id: "v3" },
    ],
  },

  hexagon: {
    name: "hexagon",
    viewBox: "0 0 200 200",
    paths: [
      // Hexagon edges (clockwise from top)
      { d: "M 100,25 L 160,55", id: "hex1" },
      { d: "M 160,55 L 160,125", id: "hex2" },
      { d: "M 160,125 L 100,155", id: "hex3" },
      { d: "M 100,155 L 40,125", id: "hex4" },
      { d: "M 40,125 L 40,55", id: "hex5" },
      { d: "M 40,55 L 100,25", id: "hex6" },
      // Spokes to center
      { d: "M 100,90 L 100,25", id: "spoke1" },
      { d: "M 100,90 L 160,55", id: "spoke2" },
      { d: "M 100,90 L 160,125", id: "spoke3" },
    ],
  },

  codebase: {
    name: "codebase",
    viewBox: "0 0 200 200",
    paths: [
      // Root vertical line
      { d: "M 35,35 L 35,165", id: "root" },
      // First level directories
      { d: "M 35,55 L 75,55", id: "dir1" },
      { d: "M 35,90 L 75,90", id: "dir2" },
      { d: "M 35,125 L 75,125", id: "dir3" },
      // Nested structure from dir1
      { d: "M 75,55 L 75,80", id: "sub1" },
      { d: "M 75,65 L 115,65", id: "file1" },
      // Nested structure from dir2
      { d: "M 75,90 L 75,115", id: "sub2" },
      { d: "M 75,100 L 135,100", id: "file2" },
      { d: "M 75,110 L 105,110", id: "file3" },
      // Cross-references (dependencies)
      { d: "M 115,65 L 155,45", id: "link1" },
      { d: "M 135,100 L 165,80", id: "link2" },
    ],
  },
};
