import React, {FormEvent, FormEventHandler, useCallback, useState} from 'react';
import {CarDTO, CarsListDTO, ManufacturerDTO} from "../models/cars.models";
import {Select, Button, MenuItem, Grid, InputLabel} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {FilterState} from "../models/filters.model";
import {capitalizeFirstLetter} from "../helpers/capitalizeFirstLetter";

interface FiltersProps {
  manufacturers?: ManufacturerDTO[],
  colors?: string[],
  onSelect: (filterState: FilterState) => void;
}

export const useCardStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: 24,
    border: '1px solid #ced4da',
  },
  selector: {
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: 8,
    marginBottom: 12,
    "&:focus": {
      backgroundColor: "white",
    },
  },
  button: {
    backgroundColor: "#EA7F28",
    color: "#EDEDED",
    marginTop: 24,
    width: 150,
    "&:focus": {
      backgroundColor: "#D37324",
    },
    "&:hover": {
      backgroundColor: "#EA7F28",
    }
  },
  label: {
    fontSize: 12,
    marginBottom: 12
  }
}));

export function Filters({manufacturers = [], colors = [], onSelect}: FiltersProps) {

  const [filter, setFilter] = useState<FilterState>({manufacturer: 'all', color: 'all'});
  const classes = useCardStyles();

  const handleSelect = useCallback((event: React.ChangeEvent<any>, field: keyof FilterState) => setFilter(prevState => ({
    ...prevState,
    [field]: event.target.value
  })), []);

  const handleSubmit = () => {
    onSelect({
      manufacturer: filter.manufacturer === 'all' ? '' : filter.manufacturer,
      color: filter.color === 'all' ? '' : filter.color,
    })
  };

  return (
    <div className={classes.container}>
      <InputLabel className={classes.label}>Color</InputLabel>
      <Select disableUnderline value={filter.color} autoWidth={true} className={classes.selector}
              data-testid="colors"
              onChange={event => handleSelect(event, 'color')}>
        <MenuItem key='all' value="all">All car colors</MenuItem>
        {colors.map((color, index) => (
          <MenuItem key={index} value={color}>{capitalizeFirstLetter(color)}</MenuItem>))}
      </Select>
      <InputLabel className={classes.label}>Manufacturer</InputLabel>
      <Select disableUnderline value={filter.manufacturer} autoWidth={true} className={classes.selector}
              data-testid="manufacturers"
              onChange={event => handleSelect(event, 'manufacturer')}>
        <MenuItem key='all' value="all">All manufacturers</MenuItem>
        {manufacturers.map((manufacturer, index) => (
          <MenuItem key={index} value={manufacturer.name}>{manufacturer.name}</MenuItem>))}
      </Select>

      <Grid container justify="flex-end">
        <Button className={classes.button} onClick={handleSubmit}>Filter</Button>
      </Grid>
    </div>
  );
};
