import { useState, React, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import './dashboard.scss';
import Navbar from '../../components/Navbar';

function Dashboard() {
  return (
    <Navbar />
  );
}

export default Dashboard;
