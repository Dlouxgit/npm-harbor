import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LayersIcon from '@mui/icons-material/Layers';
import { useRouter } from 'next/router';

export const mainListItems = () => {
  const router = useRouter();
  const { pathname } = router;
  return (
    <React.Fragment>
      <ListItemButton href="/" selected={pathname === '/'}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Release" />
      </ListItemButton>
      <ListItemButton href="/project" selected={pathname === '/project'}>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Project" />
      </ListItemButton>
    </React.Fragment>
  );
} 

export const secondaryListItems = (
  <React.Fragment>
  </React.Fragment>
);
