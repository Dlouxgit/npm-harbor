import { exec } from 'child_process';
import type { NextApiRequest, NextApiResponse } from 'next'

let msgCollect: Record<string, string> = {}
let fnCollect: Record<string, () => void> = {}
let id = 1;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {

    const { id } = req.query as { id: string }
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });

    fnCollect[id] = () => {
      res.write('event: slide\n'); // 事件类型
      res.write(`id: ${+new Date()}\n`); // 消息 ID
      res.write(`data: ${JSON.stringify(msgCollect[id])}\n`); // 消息数据
      res.write('\n\n'); // 消息结束
    }

    return
  }
  const body = req.body;

  const { version, repository, gitHubToken, npmToken, extraCode, branch, userEmail, userName, preRelease, shouldPublish } = body as { version: string, repository: string, gitHubToken: string, npmToken: string, extraCode: string, branch: string, userEmail: string, userName: string, preRelease: string, shouldPublish: boolean };
  
  release({ version, repository, id, gitHubToken, npmToken, extraCode, branch, userEmail, userName, preRelease, shouldPublish: shouldPublish ? '1' : '0' })

  res.status(200).json({ id: id++ });
}

function release({
  repository,
  version,
  id,
  gitHubToken,
  npmToken,
  extraCode,
  branch,
  userEmail,
  userName,
  preRelease,
  shouldPublish
}: Record<string, string | number>) {
  const childProcess = exec(`sh ./release.sh "${repository}" "${Math.random().toFixed(5)}" "${version}" "${gitHubToken}" "${npmToken}" "${extraCode}" "${branch}" "${userEmail}" "${userName}" "${preRelease}" "${shouldPublish}"`);

  childProcess.stdout?.on('data', function (data) {
    if (msgCollect[id]) {
      msgCollect[id] += data.toString().replace(new RegExp(gitHubToken as string, 'g'), '').replace(new RegExp(npmToken as string, 'g'), '')
      fnCollect[id]?.()
    } else {
      msgCollect[id] = data.toString()      
      fnCollect[id]?.()
    }
    console.log(data.toString());
  });

  childProcess.stderr?.on('data', function (data) {
    if (msgCollect[id]) {
      msgCollect[id] += data.toString().replace(new RegExp(gitHubToken as string, 'g'), '').replace(new RegExp(npmToken as string, 'g'), '')
      fnCollect[id]?.()
    } else {
      msgCollect[id] = data.toString()      
      fnCollect[id]?.()
    }
    console.error(data.toString());
  });

  childProcess.on('exit', function (code) {
    if (code === 0) {
      console.log('操作成功');
    } else {
      console.error('操作失败');
    }
  });
}
