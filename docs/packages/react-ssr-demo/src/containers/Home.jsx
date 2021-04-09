import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchName } from '../redux/user/actions';

const Home = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  // useEffect(() => {
  //   dispatch(fetchName()).then(res => {
  //     console.log(res)
  //   })
  // }, [])

  return (
    <>
      <h2>Home, {user.name}</h2>
      <button onClick={(e) => dispatch(fetchName())}>change name</button>
    </>
  );
};

Home.loadData = (store) => {
  return store.dispatch(fetchName());
};

export default Home;
