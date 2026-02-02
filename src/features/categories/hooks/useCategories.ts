/**
 * Category Query Hooks
 *
 * Provides React Query hooks for fetching category data.
 *
 * Follows Single Responsibility Principle:
 * - Only responsible for data fetching and caching
 * - Delegates business logic to service layer
 *
 * Follows Open/Closed Principle:
 * - Extends React Query without modifying it
 * - Easy to add new query variations
 */

import { useQuery } from '@tanstack/react-query'
import { categoryService } from '../services/category.service'
import { CategoryFilters, CategoryTreeNode, Category } from '../types/category.types'
import { useMemo } from 'react'

/**
 * Query key factory for consistent cache management
 * Prevents key duplication and typos
 */
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters?: CategoryFilters) => [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: number) => [...categoryKeys.details(), id] as const,
}

/**
 * Hook to fetch all categories with optional filters
 */
export function useCategories(filters?: CategoryFilters) {
  return useQuery({
    queryKey: categoryKeys.list(filters),
    queryFn: () => categoryService.list(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch a single category by ID
 */
export function useCategory(id: number) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.get(id),
    enabled: !!id && id > 0,
  })
}

/**
 * Hook to fetch categories organized as a hierarchical tree
 *
 * Business logic:
 * - Sorts by position
 * - Builds parent-child relationships
 * - Calculates depth levels
 * - Maintains referential integrity
 */
export function useCategoriesTree(filters?: CategoryFilters) {
  const { data: categories, ...query } = useCategories(filters)

  const tree = useMemo(() => {
    if (!categories) return []

    return buildCategoryTree(categories)
  }, [categories])

  return {
    ...query,
    data: tree,
  }
}

/**
 * Builds a hierarchical tree from flat category list
 *
 * Algorithm:
 * 1. Sort by position
 * 2. Create lookup map for O(1) access
 * 3. Build tree by linking children to parents
 * 4. Return root nodes
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function buildCategoryTree(categories: Category[]): CategoryTreeNode[] {
  // Sort by position for consistent ordering
  const sorted = [...categories].sort((a, b) => a.position - b.position)

  // Create tree nodes with initial state
  const nodeMap = new Map<number, CategoryTreeNode>()
  sorted.forEach(category => {
    nodeMap.set(category.id, {
      ...category,
      children: [],
      level: 0,
      hasChildren: false,
    })
  })

  // Build tree structure
  const rootNodes: CategoryTreeNode[] = []

  nodeMap.forEach(node => {
    if (node.parent_id === null) {
      // Root level category
      rootNodes.push(node)
    } else {
      // Child category - attach to parent
      const parent = nodeMap.get(node.parent_id)
      if (parent) {
        parent.children.push(node)
        parent.hasChildren = true
        node.level = parent.level + 1
      } else {
        // Orphaned category - treat as root
        rootNodes.push(node)
      }
    }
  })

  return rootNodes
}

/**
 * Hook to get categories suitable for parent selection
 * Excludes the current category and its descendants to prevent circular references
 */
export function useCategoriesForParentSelect(excludeId?: number) {
  const { data: categories, ...query } = useCategories()

  const availableCategories = useMemo(() => {
    if (!categories || !excludeId) return categories || []

    // Build set of excluded IDs (current category and all descendants)
    const excludedIds = new Set<number>([excludeId])
    const tree = buildCategoryTree(categories)

    function collectDescendants(nodes: CategoryTreeNode[]) {
      nodes.forEach(node => {
        if (node.id === excludeId) {
          // Add all descendants
          const addDescendants = (children: CategoryTreeNode[]) => {
            children.forEach(child => {
              excludedIds.add(child.id)
              addDescendants(child.children)
            })
          }
          addDescendants(node.children)
        }
        collectDescendants(node.children)
      })
    }

    collectDescendants(tree)

    return categories.filter(cat => !excludedIds.has(cat.id))
  }, [categories, excludeId])

  return {
    ...query,
    data: availableCategories,
  }
}
