// import fs from 'fs';
// import path from 'path';
// import { NextApiRequest, NextApiResponse } from 'next';

// type StructureNode = {
//   name: string;
//   type: 'file' | 'folder';
//   content?: string;
//   children?: StructureNode[];
// };

// function createStructure(node: StructureNode, currentPath: string) {
//   const fullPath = path.join(currentPath, node.name);

//   if (node.type === 'folder') {
//     if (!fs.existsSync(fullPath)) {
//       fs.mkdirSync(fullPath, { recursive: true });
//     }

//     node.children?.forEach(child => createStructure(child, fullPath));
//   } else if (node.type === 'file') {
//     if (!fs.existsSync(fullPath)) {
//       fs.writeFileSync(fullPath, node.content || '', 'utf8');
//     }
//   }
// }

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   const { structure, targetPath = '' } = req.body;

//   if (
//     !structure ||
//     typeof structure.name !== 'string' ||
//     !['file', 'folder'].includes(structure.type)
//   ) {
//     return res.status(400).json({ error: 'Invalid structure format' });
//   }

//   try {
//     const baseRoot = path.resolve(process.cwd(), '../external-folder');
//     const basePath = path.resolve(baseRoot, targetPath);

//     // 🔐 Safety check: prevent directory traversal outside allowed folder
//     if (!basePath.startsWith(baseRoot)) {
//       return res.status(403).json({ error: 'Access outside allowed folder denied' });
//     }

//     createStructure(structure, basePath);
//     return res.status(200).json({ message: 'Structure created successfully' });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Failed to create structure' });
//   }
// }
import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

type StructureNode = {
  name: string;
  type: 'file' | 'folder';
  children?: StructureNode[];
  content:string
};

function createStructure(node: StructureNode, currentPath: string) {
  const fullPath = path.join(currentPath, node.name);

  if (node.type === 'folder') {
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    node.children?.forEach(child => createStructure(child, fullPath));
  } else if (node.type === 'file') {
    fs.writeFileSync(fullPath, node.content ?? '', 'utf8'); // ✅ always write
  }
}


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { structure, targetPath = 'projects/temp' } = req.body;

  if (!structure || !structure.name || !structure.type) {
    return res.status(400).json({ error: 'Invalid structure format' });
  }

  try {
    const basePath = path.join(process.cwd(), "../externalFolder");
    createStructure(structure, basePath);

    return res.status(200).json({ message: 'Structure created successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create structure' });
  }
}
