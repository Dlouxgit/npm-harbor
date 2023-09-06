import type { NextApiRequest, NextApiResponse } from 'next'
import { deleteValueFromProjectJson } from '../../../utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }
  const body = req.body;

  const { repository } = body as { repository: string };
  
  deleteValueFromProjectJson(repository)
  
  res.status(200).json('Ok');
}
