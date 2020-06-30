import React from 'react'
import {render, fireEvent, within, act} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import {Favourites} from "./FavouriteList";
import {carsFixture} from "./carsFixture";
import {BrowserRouter} from "react-router-dom";
import axios from "axios";
import * as useFavorite from "../hooks/useFavourite";

const mockUseFavourites = {
  getFavorites: jest.fn(() => {
    return carsFixture.cars;
  }),
  setFavorite: jest.fn()
}

jest.mock('../hooks/useFavourite.ts', () => ({
  useFavorite: () => mockUseFavourites
}));

describe('Filters component', () => {
  it('should render favorites list with from the array of the fixtures', () => {
    const {queryAllByText} = render(
      <BrowserRouter>
        <Favourites/>
      </BrowserRouter>
    );

    const result = queryAllByText(/stock/i);
    expect(result).toHaveLength(10);
  });

  it('should render favorites from two elements one of them is with an error', () => {

    const getFavoriteImplementation = () => ([carsFixture.cars[0], {stockNumber: 1010, error: 'someerror'}] as any)
    mockUseFavourites.getFavorites.mockImplementationOnce(getFavoriteImplementation)

    const {queryAllByText, getByText} = render(
      <BrowserRouter>
        <Favourites/>
      </BrowserRouter>
    );

    const result = queryAllByText(/stock/i);
    expect(result).toHaveLength(2);
    const resultWithError = getByText(/unavailable/i);
    expect(resultWithError).toBeTruthy();
  });

  it('should call setFavorite with a proper id', () => {

    const getFavoriteImplementation = () => ([carsFixture.cars[0], {stockNumber: 1010, error: 'someerror'}] as any)
    mockUseFavourites.getFavorites.mockImplementationOnce(getFavoriteImplementation)

    const {queryAllByText, getByText} = render(
      <BrowserRouter>
        <Favourites/>
      </BrowserRouter>
    );

    const button = queryAllByText(/remove/i);
    fireEvent.click(button[0]);
    expect(mockUseFavourites.setFavorite).toHaveBeenCalledWith(carsFixture.cars[0].stockNumber);

  });
});
