export type DestinationDto = {
  destinationID: number;
  name: string;
  cityProvince: string;
  description?: string;
  estimatedBaseCostVND?: number;
  openWeatherMapCityID?: string;
};

export type PaginatedList<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
