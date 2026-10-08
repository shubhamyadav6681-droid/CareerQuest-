import { RoadmapNode } from '../types/career';

export const REVISION_DAYS_THRESHOLD = 30;
export const REVISION_MASTERY_THRESHOLD = 80;

export interface RevisionCheckResult {
  isRecommended: boolean;
  daysAgo: number | null;
  daysThreshold: number;
  masteryScore: number | null;
  masteryThreshold: number;
  reason: string;
}

export interface RevisionAlertNode extends RoadmapNode {
  daysAgo: number;
  revisionReason: string;
}

/**
 * Evaluates whether a roadmap node is recommended for automated revision:
 * Condition:
 * 1. 'lastRevisedDate' is older than 30 days
 * 2. 'masteryScore' is below 80%
 */
export function checkNeedsRevision(node: RoadmapNode): RevisionCheckResult {
  const daysThreshold = REVISION_DAYS_THRESHOLD;
  const masteryThreshold = REVISION_MASTERY_THRESHOLD;

  if (!node.lastRevisedDate || node.masteryScore === undefined) {
    return {
      isRecommended: false,
      daysAgo: null,
      daysThreshold,
      masteryScore: node.masteryScore ?? null,
      masteryThreshold,
      reason: 'No revision date or mastery score recorded.',
    };
  }

  const revisedTime = new Date(node.lastRevisedDate).getTime();
  if (isNaN(revisedTime)) {
    return {
      isRecommended: false,
      daysAgo: null,
      daysThreshold,
      masteryScore: node.masteryScore,
      masteryThreshold,
      reason: 'Invalid lastRevisedDate format.',
    };
  }

  const diffMs = Date.now() - revisedTime;
  const daysAgo = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const isOlderThan30Days = daysAgo > daysThreshold;
  const isMasteryBelow80 = node.masteryScore < masteryThreshold;
  const isRecommended = isOlderThan30Days && isMasteryBelow80;

  let reason = '';
  if (isRecommended) {
    reason = `Last revised ${daysAgo} days ago (exceeds ${daysThreshold} days) with ${node.masteryScore}% mastery (below ${masteryThreshold}%). Spaced repetition revision recommended.`;
  } else if (!isOlderThan30Days && isMasteryBelow80) {
    reason = `Mastery is ${node.masteryScore}% (< 80%), but topic was revised ${daysAgo} days ago (within 30 days).`;
  } else if (isOlderThan30Days && !isMasteryBelow80) {
    reason = `Last revised ${daysAgo} days ago, but mastery is strong at ${node.masteryScore}% (>= 80%).`;
  } else {
    reason = `Recently revised with high mastery (${node.masteryScore}%).`;
  }

  return {
    isRecommended,
    daysAgo,
    daysThreshold,
    masteryScore: node.masteryScore,
    masteryThreshold,
    reason,
  };
}

/**
 * Annotates a list of roadmap nodes with the automated revision check flag
 */
export function applyAutomatedRevisionCheck(nodes: RoadmapNode[]): RoadmapNode[] {
  return nodes.map((node) => {
    const check = checkNeedsRevision(node);
    return {
      ...node,
      isRecommendedForRevision: check.isRecommended,
    };
  });
}

/**
 * Returns all nodes that qualify for automated revision, sorted by urgency
 * (lowest mastery score and highest days since revision first)
 */
export function getRecommendedRevisionNodes(nodes: RoadmapNode[]): RevisionAlertNode[] {
  const result: RevisionAlertNode[] = [];

  for (const node of nodes) {
    const check = checkNeedsRevision(node);
    if (check.isRecommended && check.daysAgo !== null) {
      result.push({
        ...node,
        isRecommendedForRevision: true,
        daysAgo: check.daysAgo,
        revisionReason: check.reason,
      });
    }
  }

  // Sort by lowest mastery score first, then most days ago
  return result.sort((a, b) => {
    const aScore = a.masteryScore ?? 0;
    const bScore = b.masteryScore ?? 0;
    if (aScore !== bScore) {
      return aScore - bScore;
    }
    return b.daysAgo - a.daysAgo;
  });
}
