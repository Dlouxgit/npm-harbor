import { exec } from 'child_process';
import type { NextApiRequest, NextApiResponse } from 'next'

let msgCollect: Record<string, string> = {}
let id = 1;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }

  const { version, repository, gitHubToken, npmToken, extraCode, branch } = req.body as { version: string, repository: string, gitHubToken: string, npmToken: string, extraCode: string, branch: string };
  
  release({ version, repository, id, gitHubToken, npmToken, extraCode, branch })

  console.log('extraCode', extraCode)

  setTimeout(() => {
    const msg = msgCollect[id++]?.split('\n').slice(-3).join(' ').trim()
    if (msg && msg.indexOf('Clon') === -1) {
        res.status(200).json(msg);
    } else {
        res.status(200).json('Network is too slow, Please try again.');
    }
  }, 5000)
}

function release({
  repository,
  version,
  id,
  gitHubToken,
  npmToken,
  extraCode,
  branch
}: Record<string, string | number>) {
  const childProcess = exec(`sh ./get_version.sh "${repository}" "${Math.random().toFixed(5)}" "${version}" "${gitHubToken}" "${npmToken}" "${extraCode}" "${branch}"`);

  childProcess.stdout?.on('data', function (data) {
    if (msgCollect[id]) {
      msgCollect[id] += data.toString()
    } else {
      msgCollect[id] = data.toString()      
    }
    console.log(data.toString());
  });

  childProcess.stderr?.on('data', function (data) {
    if (msgCollect[id]) {
      msgCollect[id] += data.toString()
    } else {
      msgCollect[id] = data.toString()      
    }
    console.error(data.toString());
  });

  childProcess.on('exit', function (code) {
    if (code === 0) {
      console.log('生成成功');
    } else {
      console.error('生成失败');
    }
  });
}
