import {renderHook, act} from '@testing-library/react-hooks';
import axios from 'axios';
import {useFavorite} from "./useFavourite";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;


const mockStorage = () => {
  let storage: any = {};
  return {
    getItem: (key: any) => (key in storage ? storage[key] : null),
    setItem: (key: any, value: any) => (storage[key] = value || ''),
    removeItem: (key: any) => delete storage[key],
    clear: () => (storage = {}),
  };
};

Object.defineProperty(window, 'localStorage', {value: mockStorage()});

describe('useFavorite hook', () => {

  it('should return data set in favorites and then clear it on the second call', async () => {

    mockedAxios.get.mockImplementationOnce(() => Promise.resolve(({
      data: {
        car: {
          stockNumber: 100,
          data: 'somedata'
        }
      }
    })));

    const {result, waitForNextUpdate} = renderHook(
      () => useFavorite()
    );

    act(() => result.current.setFavorite('11100'));
    await waitForNextUpdate();
    expect(result.current.getFavorites()).toEqual([{stockNumber: 100, data: 'somedata'}]);

    // act(() => result.current.setFavorite('11100'));
    // expect(result.current.getFavorites()).toEqual([]);
  })

});
