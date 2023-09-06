import type { NextApiRequest, NextApiResponse } from 'next'
import { addValueToProjectJson } from '../../../utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }
  const body = req.body;

  const { name, repository, extraCode } = body as { name: string, repository: string, extraCode: string };
  
  addValueToProjectJson({ name, repository, extraCode })

  res.status(200).json('Ok');
}
