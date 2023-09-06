import type { NextApiRequest, NextApiResponse } from 'next'
import { readProjectJson } from '../../../utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).send({ message: 'Only GET requests allowed' })
    return
  }
  readProjectJson()
  
  res.status(200).json(readProjectJson());
}
