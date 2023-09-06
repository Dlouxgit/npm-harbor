import { ChangeEventHandler, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
}));

interface IProject {name: string, repository: string, extraCode: string}

export default function Publish() {
  const [repository, setRepository] = useState('');
  const [genMsg, setGenMsg] = useState([]);
  const [msg, setMsg] = useState([]);
  const [branch, setBranch] = useState('');
  const [projectList, setProjectList] = useState<IProject[]>([]);

  const getProjectList = () => {
    fetch('/api/project/get', {
    }).then(async (res) => {
      const r = await res.json()
      setProjectList(r)
    })
  }

  useEffect(() => {
    getProjectList()
  }, [])
  
  const [version, setVersion] = useState('');

  const handleVersionChange = (event: SelectChangeEvent) => {
    setVersion(event.target.value as string);
  };

  const [extraCode, setExtracode] = useState('');


  const handleRepositoryChange = (event: SelectChangeEvent) => {
    setRepository(event.target.value as string);
    const defaultCode = projectList.find(project => project.repository === event.target.value)?.extraCode
    if (defaultCode) {
      setExtracode(defaultCode)
    }
  };

  const handleBranch: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
    setBranch(event.target.value as string);
  };

  const handleExtraCode: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
    setExtracode(event.target.value as string);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const req = {
      repository,
      version,
      // CustomVersion: data.get('CustomVersion'),
    }
    console.log(req);
  };

  const handlePkgPublish = () => {
    let gitHubToken = localStorage.getItem('gitHubToken') || ''
    let npmToken = localStorage.getItem('npmToken') || ''
    if (!gitHubToken) {
      gitHubToken = prompt('请输入 githubToken') as string
      if (!gitHubToken) {
        return 
      }
      localStorage.setItem('gitHubToken', gitHubToken)
    }
    if (!npmToken) {
      npmToken = prompt('请输入 npmToken') as string
      if (!npmToken) {
        return 
      }
      localStorage.setItem('npmToken', npmToken)
    }
    const req = {
      repository,
      version,
      gitHubToken,
      npmToken,
      extraCode,
      branch
    }
    fetch('/api/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    }).then(async (res) => {
      const { id } = await res.json()

      if (window.EventSource) {
        // 创建 EventSource 对象连接服务器
        const source = new EventSource('http://localhost:3000/api/create?id=' + id);
      
        // 连接成功后会触发 open 事件
        source.addEventListener('open', () => {
          console.log('Connected');
        }, false);
      
        // 服务器发送信息到客户端时，如果没有 event 字段，默认会触发 message 事件
        source.addEventListener('message', e => {
          console.log(`data: ${e.data}`);
        }, false);
      
        // 自定义 EventHandler，在收到 event 字段为 slide 的消息时触发
        source.addEventListener('slide', e => {
          console.log(`data: ${e.data}`, e); // => data: 7
          setMsg(e.data.split('\\n'))
        }, false);
      
        // 连接异常时会触发 error 事件并自动重连
        source.addEventListener('error', e => {
          // @ts-ignore
          if (e.target.readyState === EventSource.CLOSED) {
            console.log('Disconnected');
            // @ts-ignore
          } else if (e.target.readyState === EventSource.CONNECTING) {
            console.log('Connecting...');
          }
        }, false);
      } else {
        console.error('Your browser doesn\'t support SSE');
      }
    })
  }

  const handlePkgGenerate = () => {
    let gitHubToken = localStorage.getItem('gitHubToken') || ''
    let npmToken = localStorage.getItem('npmToken') || ''
    if (!gitHubToken) {
      gitHubToken = prompt('请输入 githubToken') as string
      if (!gitHubToken) {
        return 
      }
      localStorage.setItem('gitHubToken', gitHubToken)
    }
    const req = {
      repository,
      version,
      gitHubToken,
      npmToken,
      extraCode,
      branch
    }
    fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    }).then(async (res) => {
      const r = await res.json()
      console.log('res', r)
      setGenMsg(r)
      // setColorList(resp.keys || [])
    })
  }

  const genBasicSelect = (props: { label: string, list: IProject[], value: any, handleChange: (event: SelectChangeEvent) => void }) => {
    return (
      <FormControl margin="normal" fullWidth>
        <InputLabel>{props.label}</InputLabel>
        <Select
          value={props.value}
          name={props.label}
          label={props.label}
          onChange={props.handleChange}
        >
          {
            props.list.map(v => (
              <MenuItem key={v.repository} value={v.repository}>{v.name}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
    )
  }

  const genVersionSelect = (props: { label: string, list: string[], value: any, handleChange: (event: SelectChangeEvent) => void }) => {
    return (
      <FormControl margin="normal" fullWidth>
        <InputLabel>{props.label}</InputLabel>
        <Select
          value={props.value}
          name={props.label}
          label={props.label}
          onChange={props.handleChange}
        >
          {
            props.list.map(v => (
              <MenuItem key={v} value={v}>{v}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
    )
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }} alignItems="center">
      <Grid container spacing={2} justifyContent="flex-start">
        <Grid item xs={4}>
          {
            genBasicSelect({
              label: 'Repository', 
              list: projectList,
              value: repository,
              handleChange: handleRepositoryChange
            })
          }
        </Grid>
        <Grid item xs={4}>
          {
            genVersionSelect({
              label: 'Version', 
              list: ['major', 'minor', 'patch', 'premajor', 'preminor', 'prepatch', 'prerelease'],
              value: version,
              handleChange: handleVersionChange
            })
          }
        </Grid>
        <Grid item>
          <TextField
            margin="normal"
            name="branch"
            value={branch}
            autoComplete="branch"
            label="Branch"
            onChange={handleBranch}
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
      </Grid>
      <Grid container spacing={2}>
        <Grid item>
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handlePkgGenerate}
          >
            Generate
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handlePkgPublish}
          >
            Publish
          </Button>
        </Grid>
      </Grid>
      <div>
        {genMsg ? `Version Changes: ${genMsg}` : genMsg}
      </div>
      <ThemeProvider theme={darkTheme}>
        <Box
          sx={{
            p: 2,
            bgcolor: 'background.default',
          }}
        >
          <Item>
            {msg.map((msg, index) => (
              <p key={index}>{msg}</p>
            ))}
          </Item>
        </Box>
      </ThemeProvider>
    </Box>
  );
}