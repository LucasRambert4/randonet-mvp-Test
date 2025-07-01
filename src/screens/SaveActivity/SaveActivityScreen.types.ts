// SaveActivityScreen.types.ts

export type SaveActivityRouteParams = {
  route: any[]; // GPS path
  distance: number;
  startTime: Date | null;
  endTime: Date;
  elevation: number;
  location: string;
  trailId?: string | null;
  activityId?: string; // If editing
  existingData?: any; // If editing
};
