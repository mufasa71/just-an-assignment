import React, {useReducer, useState} from 'react';
import axios from 'axios';
import {CarsList} from "../components/CarsList";
import {carsFixture} from "../components/carsFixture";
import {Action, CarsState} from "../models/store.model";
import {useFetching} from "../hooks/useFetching";
import {CarDTO, CarsListDTO} from "../models/cars.models";
import {Filters} from "../components/Filters";

export function carsReducer(state: CarsState, action: Action): CarsState {
  switch (action.type) {
    case "SET_PAGE":
      return {...state, currentPage: action.payload};
      break;
    case "SET_FILTER":
      const field = action.payload.filterType === 'manufacturer' ? 'selectedManufacturer' : 'selectedColor';
      return {...state, [field]: action.payload.value};
      break;
    case "SET_CARS":
      const {cars, totalPageCount} = action.payload;
      return {...state, cars, totalPageCount};
      break;
    default:
      return state;
  }
}

export const initialState: CarsState = {
  cars: [],
  totalPageCount: 0,
  currentPage: 1,
  selectedColor: '',
  selectedManufacturer: ''
}

async function fetchCars(): Promise<CarsListDTO> {
  const result = await axios.get<CarsListDTO>('https://auto1-mock-server.herokuapp.com/api/cars');
  return result.data;
}

async function fetchManufacturersAndColors() {
  const [manufacturersResponse, colorsResponse] = await Promise.all([
    axios.get('https://auto1-mock-server.herokuapp.com/api/manufacturers'),
    axios.get('https://auto1-mock-server.herokuapp.com/api/colors'),
  ]);
  return {manufacturers: manufacturersResponse.data.manufacturers, colors: colorsResponse.data.colors}
}

export function Cars() {
  const [state, dispatch] = useReducer(carsReducer, initialState);

  const carsState = useFetching(async () => {
    const result = await fetchCars();
    dispatch({type: 'SET_CARS', payload: result})
    return result;
  }, null, []);

  const manufacturersAndColors = useFetching(async () => {
      const result = await fetchManufacturersAndColors();
      return result;
    }, {manufacturers: [], colors: []}, []
  );

  console.log(manufacturersAndColors);
  if (carsState.isLoading || carsState.error) {
    return null;
  }
  return (
    <div>
      <Filters manufacturers={manufacturersAndColors.data.manufacturers} colors={manufacturersAndColors.data.colors}
               onSelect={console.log}/>
      <CarsList list={state.cars} page={state.currentPage} totalPageCount={state.totalPageCount}
                onPageSelect={(pageNumber) => dispatch({type: 'SET_PAGE', payload: pageNumber})}/>
    </div>
  );
};
