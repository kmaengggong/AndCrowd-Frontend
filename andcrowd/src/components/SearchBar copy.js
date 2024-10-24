import * as React from 'react';
import { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  height: '100%',
  position: 'absolute',
  
   right: '0', 
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1,1,1,2),
      transition :theme.transitions.create('width'),
      width:'100%',
      paddingRight : "50px",
      border : '1px solid #00D337',
      borderRadius:'10px',
       height : "30px",
       fontSize : "14px",
       fontFamily : "'Noto Sans KR', sans-serif"
    },
}));

function SearchBar({ onSearch }) {

  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSearchClick = () => {
    // 검색 버튼 클릭 시, 부모 컴포넌트(AndScroll.js)의 적절한 함수(onSearchClick)를 호출합니다.
    onSearch(searchKeyword);
    setSearchKeyword('');
  };

  return (
    <Search>
      <SearchIconWrapper>
        <IconButton onClick={handleSearchClick}>
          <SearchIcon />
        </IconButton>
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="검색어를 입력해주세요"
        inputProps={{ 'aria-label': 'search' }}
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />
    </Search>
  );
}
export default SearchBar;
