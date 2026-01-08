// SVG path definitions for realistic truck routing through the yard
export const YARD_PATHS = {
  // Complete journey: offscreen → inbound lane → ingate → routing → dock → outgate → exit lane → offscreen
  fullJourney: 'M 20 480 L 80 450 L 150 415 L 220 380 L 280 345 L 340 315 L 400 285 L 460 260 L 520 240 L 580 225 L 640 215 L 700 210 L 760 210',
  
  // Inbound approach (before entering yard fence)
  inboundLane: 'M 20 480 L 80 450 L 140 420',
  
  // Through ingate to routing
  ingateToRouting: 'M 140 420 L 180 395 L 220 370',
  
  // Internal yard routing to dock
  yardRoute: 'M 220 370 L 280 340 L 340 315',
  
  // Dock to outgate
  dockToOutgate: 'M 340 315 L 400 290 L 460 270',
  
  // Outgate through exit lane (offscreen)
  exitLane: 'M 460 270 L 520 250 L 580 235 L 640 225 L 700 220 L 760 220',
};

// Helper to get point along SVG path at given progress (0-1)
export function getPointAlongPath(pathString: string, progress: number): { x: number; y: number } {
  if (typeof document === 'undefined') {
    return { x: 0, y: 0 };
  }
  
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathString);
  
  const length = path.getTotalLength();
  const point = path.getPointAtLength(length * Math.max(0, Math.min(1, progress)));
  
  return { x: point.x, y: point.y };
}

// Get rotation angle along path
export function getRotationAlongPath(pathString: string, progress: number): number {
  const point1 = getPointAlongPath(pathString, Math.max(0, progress - 0.01));
  const point2 = getPointAlongPath(pathString, Math.min(1, progress + 0.01));
  
  const angle = Math.atan2(point2.y - point1.y, point2.x - point1.x) * (180 / Math.PI);
  return angle;
}
