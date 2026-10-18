import * as React from '../react.js';
import { SVGProps } from '../react.js';
import { Coordinate } from '../util/types.js';
import { roundTemplateLiteral } from '../util/round.js';
const isValidatePoint = (point: Coordinate | undefined): point is Coordinate => {
  return point != null && point.x === +point.x && point.y === +point.y;
};
const getParsedPoints = (points: ReadonlyArray<Coordinate> = []) => {
  let segmentPoints: Coordinate[][] = [[]];

  points.forEach(entry => {
    const lastLink = segmentPoints[segmentPoints.length - 1];
    if (isValidatePoint(entry)) {
      if (lastLink) {
        lastLink.push(entry);
      }
    } else if (lastLink && lastLink.length > 0) {
      // add another path
      segmentPoints.push([]);
    }
  });

  const firstPoint = points[0];
  const lastLink = segmentPoints[segmentPoints.length - 1];
  if (isValidatePoint(firstPoint) && lastLink) {
    lastLink.push(firstPoint);
  }

  const finalLink = segmentPoints[segmentPoints.length - 1];
  if (finalLink && finalLink.length <= 0) {
    segmentPoints = segmentPoints.slice(0, -1);
  }

  return segmentPoints;
};
export const getSinglePolygonPath = (points: ReadonlyArray<Coordinate>, connectNulls?: boolean) => {
  let segmentPoints = getParsedPoints(points);

  if (connectNulls) {
    segmentPoints = [
      segmentPoints.reduce((res: Coordinate[], segPoints: Coordinate[]) => {
        return [...res, ...segPoints];
      }, []),
    ];
  }

  const polygonPath = segmentPoints
    .map(segPoints => {
      return segPoints.reduce((path: string, point: Coordinate, index: number) => {
        return roundTemplateLiteral`${path}${index === 0 ? 'M' : 'L'}${point.x},${point.y}`;
      }, '');
    })
    .join('');

  return segmentPoints.length === 1 ? `${polygonPath}Z` : polygonPath;
};
export const getRanglePath = (
  points: ReadonlyArray<Coordinate>,
  baseLinePoints: ReadonlyArray<Coordinate>,
  connectNulls?: boolean,
) => {
  const outerPath = getSinglePolygonPath(points, connectNulls);

  return `${outerPath.slice(-1) === 'Z' ? outerPath.slice(0, -1) : outerPath}L${getSinglePolygonPath(
    Array.from(baseLinePoints).reverse(),
    connectNulls,
  ).slice(1)}`;
};
interface PolygonProps {
  className?: string;
  /**
   * The coordinates of all the vertexes of the polygon, like an array of objects with x and y coordinates.
   */
  points?: ReadonlyArray<Coordinate>;
  baseLinePoints?: ReadonlyArray<Coordinate>;
  connectNulls?: boolean;

  /**
   * The customized event handler of click on the polygon
   */
  onClick?: (e: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
  /**
   * The customized event handler of mousedown on the polygon
   */
  onMouseDown?: (e: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
  /**
   * The customized event handler of mouseup on the polygon
   */
  onMouseUp?: (e: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
  /**
   * The customized event handler of mousemove on the polygon
   */
  onMouseMove?: (e: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
  /**
   * The customized event handler of mouseover on the polygon
   */
  onMouseOver?: (e: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
  /**
   * The customized event handler of mouseout on the polygon
   */
  onMouseOut?: (e: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
  /**
   * The customized event handler of mouseenter on the polygon
   */
  onMouseEnter?: (e: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
  /**
   * The customized event handler of mouseleave on the polygon
   */
  onMouseLeave?: (e: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
}
export type Props = Omit<SVGProps<SVGPolygonElement>, 'points'> & PolygonProps;
