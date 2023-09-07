import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Grid, TextField } from '@mui/material';
import { ChangeEventHandler, useEffect, useState } from 'react';

export default function BasicTable() {
  const [projectList, setProjectList] = useState<{name: string, repository: string, extraCode: string}[]>([]);
  const [name, setName] = useState('');
  const handleName: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
    setName(event.target.value as string);
  };

  const [repository, setRepository] = useState('');
  const handleRepository: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
    setRepository(event.target.value as string);
  };

  const [extraCode, setExtraCode] = useState('');
  const handleExtraCode: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
    setExtraCode(event.target.value as string);
  };

  const getProjectList = () => {
    fetch('/api/project/get', {
    }).then(async (res) => {
      const r = await res.json()
      setProjectList(r)
    })
  }

  const addProject = () => {
    if (!name || !repository) {
      return
    }
    const req = {
      name,
      repository,
      extraCode
    }
    fetch('/api/project/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    }).then(async (res) => {
      const r = await res.json()
      console.log('res', r)
      getProjectList()
    })
  }

  const delProject = (repository: string) => {
    const req = {
      repository,
    }
    fetch('/api/project/del', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    }).then(async (res) => {
      const r = await res.json()
      console.log('res', r)
      getProjectList()
      // setColorList(resp.keys || [])
    })
  }

  useEffect(() => {
    getProjectList()
  }, [])

  return (
    <TableContainer component={Paper}>
      <Grid container spacing={2} sx={{p:2}} justifyContent="flex-start">
        <Grid item>
          <TextField
            margin="normal"
            name="Name"
            value={name}
            autoComplete="Name"
            label="Name"
            onChange={handleName}
          />
        </Grid>
        <Grid item>
          <TextField
            margin="normal"
            name="Repository"
            value={repository}
            autoComplete="Repository"
            label="Repository"
            onChange={handleRepository}
          />
        </Grid>
        <Grid item>
          <TextField
            margin="normal"
            name="ExtraCode"
            value={extraCode}
            autoComplete="ExtraCode"
            label="ExtraCode"
            onChange={handleExtraCode}
          />
        </Grid>
        <Grid sx={{p:2}}>
          <Button
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            color="success"
            onClick={addProject}
          >
            add
          </Button>
        </Grid>
      </Grid>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Repository</TableCell>
            <TableCell>Extra Code&nbsp;</TableCell>
            <TableCell>Action&nbsp;</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projectList.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell>{row.repository}</TableCell>
              <TableCell>{row.extraCode}</TableCell>
              <TableCell padding="checkbox">
                <Button
                  variant="outlined"
                  sx={{ mt: 3, mb: 2 }}
                  color="error"
                  onClick={() => delProject(row.repository)}
                >
                  del
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
