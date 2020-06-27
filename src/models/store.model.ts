import {CarDTO, CarsListDTO} from "./cars.models";

export type ActionType = 'SET_PAGE' | 'SET_FILTER';

export interface SetFilter {
  filterType: 'manufacturer' | 'color';
  value: string;
}

export type Action = {
  type: 'SET_PAGE',
  payload: number;
} | {
  type: 'SET_FILTER',
  payload: SetFilter
} | {
  type: 'SET_CARS',
  payload: CarsListDTO
}

export interface CarsState {
  currentPage: number;
  totalPageCount: number;
  cars: CarDTO[];
  selectedManufacturer: string;
  selectedColor: string;
}