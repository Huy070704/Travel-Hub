export type DestinationDto = {
  destinationID: number;
  name: string;
  cityProvince: string;
  description?: string;
  rate?: number;
  image?: string;
  keyMain?: string;
  entranceFee?: number;
  accommodationCost?: number;
  totalTourCost?: number;
  tourPricePerPerson?: number;
};

export type PaginatedList<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
