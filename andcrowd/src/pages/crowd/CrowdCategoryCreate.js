import React, { useState } from "react";
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

const categories = [
  {
    name: '1',
    text: '문화/예술'
  },
  {
    name: '2',
    text: '액티비티/스포츠'
  },
  {
    name: '3',
    text: '테크/가전'
  },
  {
    name: '4',
    text: '푸드'
  },
  {
    name: '5',
    text: '언어'
  },
  {
    name: '6',
    text: '여행'
  },
  {
    name: '7',
    text: '반려동물'
  },
  {
    name: '8',
    text: '기타'
  },
];

const CrowdCategoryCreate = ({ value, onChange }) => {

  return (
    <Grid item xs={9} sm={6}>
      <TextField
        required
        fullWidth
        id="crowdCategoryId"
        label="카테고리 설정"
        name="crowdCategoryId"
        select
        value={value}
        onChange={onChange}
      >
        <MenuItem value="0">--카테고리 선택--</MenuItem>
        {categories.map((category) => (
          <MenuItem key={category.name} value={category.name}>
            {category.text}
          </MenuItem>
        ))}
      </TextField>
    </Grid>
  );
}

export default CrowdCategoryCreate;
