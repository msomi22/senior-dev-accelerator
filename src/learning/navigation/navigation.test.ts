import assert from 'node:assert/strict';
import test from 'node:test';

import type { LearningNode } from '../core/index.ts';
import { createLearningNodeRegistry } from '../registry/index.ts';
import {
  flattenDepthFirst,
  getBreadcrumbs,
  getFirstChild,
  getLastChild,
  getNavigationContext,
  getNearestNavigableAncestor,
  getNextNodeDepthFirst,
  getNextSibling,
  getPreviousNodeDepthFirst,
  getPreviousSibling,
  getSiblings
} from './index.ts';

function node(input: Partial<LearningNode> & Pick<LearningNode, 'id' | 'kind' | 'label'>): LearningNode {
  return input;
}

const platform = node({
  id: 'platform',
  kind: 'platform',
  label: 'Qubitel Academy',
  childIds: ['tech']
});
const tech = node({
  id: 'tech',
  kind: 'academy',
  label: 'Technology Academy',
  parentId: 'platform',
  childIds: ['dsa', 'java']
});
const dsa = node({
  id: 'dsa',
  kind: 'category',
  label: 'DSA',
  parentId: 'tech',
  childIds: ['sliding-window', 'two-pointers']
});
const java = node({
  id: 'java',
  kind: 'category',
  label: 'Java',
  parentId: 'tech'
});
const slidingWindow = node({
  id: 'sliding-window',
  kind: 'topic',
  label: 'Sliding Window',
  parentId: 'dsa',
  childIds: ['lesson-1', 'practice-1']
});
const twoPointers = node({
  id: 'two-pointers',
  kind: 'topic',
  label: 'Two Pointers',
  parentId: 'dsa'
});
const lesson = node({
  id: 'lesson-1',
  kind: 'lesson',
  label: 'Lesson 1',
  parentId: 'sliding-window'
});
const practice = node({
  id: 'practice-1',
  kind: 'practice',
  label: 'Practice 1',
  parentId: 'sliding-window'
});

function registry() {
  return createLearningNodeRegistry({
    nodes: [platform, tech, dsa, java, slidingWindow, twoPointers, lesson, practice]
  });
}

test('builds navigation context for a known node', () => {
  const context = getNavigationContext(registry(), 'sliding-window');

  assert.equal(context.current?.id, 'sliding-window');
  assert.equal(context.parent?.id, 'dsa');
  assert.deepEqual(context.children.map((child) => child.id), ['lesson-1', 'practice-1']);
  assert.deepEqual(context.siblings.map((sibling) => sibling.id), ['sliding-window', 'two-pointers']);
  assert.equal(context.previousSibling, undefined);
  assert.equal(context.nextSibling?.id, 'two-pointers');
  assert.deepEqual(context.breadcrumbs.map((breadcrumb) => breadcrumb.id), [
    'platform',
    'tech',
    'dsa',
    'sliding-window'
  ]);
});

test('returns safe context for unknown node id', () => {
  const context = getNavigationContext(registry(), 'missing');

  assert.equal(context.current, undefined);
  assert.equal(context.parent, undefined);
  assert.deepEqual(context.children, []);
  assert.deepEqual(context.siblings, []);
  assert.deepEqual(context.breadcrumbs, []);
});

test('returns breadcrumbs root-to-current', () => {
  assert.deepEqual(getBreadcrumbs(registry(), 'practice-1').map((node) => node.id), [
    'platform',
    'tech',
    'dsa',
    'sliding-window',
    'practice-1'
  ]);
});

test('returns breadcrumbs without current when option disables it', () => {
  assert.deepEqual(
    getBreadcrumbs(registry(), 'practice-1', { includeCurrentInBreadcrumbs: false }).map((node) => node.id),
    ['platform', 'tech', 'dsa', 'sliding-window']
  );
});

test('looks up siblings and previous or next sibling', () => {
  const testRegistry = registry();

  assert.deepEqual(getSiblings(testRegistry, 'two-pointers').map((sibling) => sibling.id), [
    'sliding-window',
    'two-pointers'
  ]);
  assert.equal(getPreviousSibling(testRegistry, 'two-pointers')?.id, 'sliding-window');
  assert.equal(getNextSibling(testRegistry, 'sliding-window')?.id, 'two-pointers');
  assert.equal(getPreviousSibling(testRegistry, 'sliding-window'), undefined);
  assert.equal(getNextSibling(testRegistry, 'two-pointers'), undefined);
});

test('looks up first and last child', () => {
  const testRegistry = registry();

  assert.equal(getFirstChild(testRegistry, 'sliding-window')?.id, 'lesson-1');
  assert.equal(getLastChild(testRegistry, 'sliding-window')?.id, 'practice-1');
  assert.equal(getFirstChild(testRegistry, 'two-pointers'), undefined);
  assert.equal(getLastChild(testRegistry, 'two-pointers'), undefined);
});

test('returns deterministic depth-first ordering', () => {
  assert.deepEqual(flattenDepthFirst(registry()).map((node) => node.id), [
    'platform',
    'tech',
    'dsa',
    'sliding-window',
    'lesson-1',
    'practice-1',
    'two-pointers',
    'java'
  ]);
});

test('looks up depth-first next and previous node', () => {
  const testRegistry = registry();

  assert.equal(getNextNodeDepthFirst(testRegistry, 'sliding-window')?.id, 'lesson-1');
  assert.equal(getPreviousNodeDepthFirst(testRegistry, 'sliding-window')?.id, 'dsa');
  assert.equal(getNextNodeDepthFirst(testRegistry, 'java'), undefined);
  assert.equal(getPreviousNodeDepthFirst(testRegistry, 'platform'), undefined);
});

test('finds nearest navigable ancestor while skipping configured kinds', () => {
  const testRegistry = registry();

  assert.equal(getNearestNavigableAncestor(testRegistry, 'practice-1')?.id, 'sliding-window');
  assert.equal(
    getNearestNavigableAncestor(testRegistry, 'practice-1', { skipKinds: ['topic'] })?.id,
    'dsa'
  );
});

test('skipKinds affects breadcrumbs, children, and flattened traversal', () => {
  const testRegistry = registry();

  assert.deepEqual(
    getBreadcrumbs(testRegistry, 'practice-1', { skipKinds: ['topic'] }).map((node) => node.id),
    ['platform', 'tech', 'dsa', 'practice-1']
  );
  assert.deepEqual(
    getNavigationContext(testRegistry, 'sliding-window', { skipKinds: ['lesson'] }).children.map((node) => node.id),
    ['practice-1']
  );
  assert.deepEqual(
    flattenDepthFirst(testRegistry, { skipKinds: ['practice'] }).map((node) => node.id),
    ['platform', 'tech', 'dsa', 'sliding-window', 'lesson-1', 'two-pointers', 'java']
  );
});

test('traversal remains cycle-safe', () => {
  const cycleA = node({ id: 'cycle-a', kind: 'topic', label: 'Cycle A', childIds: ['cycle-b'] });
  const cycleB = node({ id: 'cycle-b', kind: 'topic', label: 'Cycle B', childIds: ['cycle-a'] });
  const testRegistry = createLearningNodeRegistry({ nodes: [cycleA, cycleB] });

  assert.deepEqual(flattenDepthFirst(testRegistry).map((item) => item.id), ['cycle-a', 'cycle-b']);
  assert.deepEqual(getBreadcrumbs(testRegistry, 'cycle-a').map((item) => item.id), ['cycle-b', 'cycle-a']);
});

test('navigation helpers do not mutate input registry nodes', () => {
  const inputNodes = [platform, tech, dsa, slidingWindow, lesson];
  const snapshot = JSON.stringify(inputNodes);
  const testRegistry = createLearningNodeRegistry({ nodes: inputNodes });

  getNavigationContext(testRegistry, 'sliding-window');
  getBreadcrumbs(testRegistry, 'lesson-1');
  flattenDepthFirst(testRegistry);

  assert.equal(JSON.stringify(inputNodes), snapshot);
});
