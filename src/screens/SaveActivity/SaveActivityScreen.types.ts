export type SaveActivityRouteParams = {
  route: any[];
  distance: number;
  startTime: Date | null;
  endTime: Date;
  elevation: number;
  location: string;
  trailId?: string | null;
  activityId?: string;
  existingData?: any;
};
