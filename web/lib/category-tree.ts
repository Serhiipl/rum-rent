import type { Category } from "./mongo-operations";

export type CategoryNode = Category & {
  children: CategoryNode[];
};

const sortNodes = (nodes: CategoryNode[]) => {
  nodes.sort((a, b) =>
    a.name.localeCompare(b.name, "pl", { sensitivity: "base" })
  );
  nodes.forEach((node) => {
    if (node.children.length > 0) {
      sortNodes(node.children);
    }
  });
};

export function buildCategoryTree(categories: Category[]): CategoryNode[] {
  const nodes = new Map<string, CategoryNode>();

  categories.forEach((category) => {
    nodes.set(category.id, { ...category, children: [] });
  });

  const roots: CategoryNode[] = [];

  nodes.forEach((node) => {
    if (node.parentId && nodes.has(node.parentId)) {
      nodes.get(node.parentId)?.children.push(node);
    } else {
      roots.push(node);
    }
  });

  sortNodes(roots);

  return roots;
}

export function flattenCategoryTree(
  tree: CategoryNode[],
  depth = 0
): Array<{ node: CategoryNode; depth: number }> {
  return tree.flatMap((node) => [
    { node, depth },
    ...flattenCategoryTree(node.children, depth + 1),
  ]);
}
