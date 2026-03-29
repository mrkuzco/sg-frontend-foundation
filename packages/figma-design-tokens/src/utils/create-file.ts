import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { logMessage } from './logMessage';

export type FileExportType = 'ts' | 'js';

export const createTokenFile = async (
  content: string | Uint8Array,
  outputName: string,
  nodeId: string,
  distFolder?: string,
  fileExportType?: FileExportType,
  logPrefix?: string
) => {
  const filePath = `${distFolder || 'design/tokens'}`;
  const idPath = nodeId?.length
    ? `-${nodeId.trim().replace(/:/g, '-').toLowerCase().trim()}`
    : '';
  const fileName = `design-token-${outputName}${idPath}`;
  const fileType = fileExportType || 'ts';

  try {
    if (!existsSync(filePath)) {
      mkdirSync(filePath, { recursive: true });
    }

    await writeFile(`${filePath}/${fileName}.${fileType}`, content, {
      encoding: 'utf8',
      flag: 'w',
    });

    logMessage(
      `${logPrefix ? `[${logPrefix}] ` : ''}File created: ${filePath}/${fileName}.${fileType}`,
      'success'
    );
  } catch (error) {
    logMessage(
      `${logPrefix ? `[${logPrefix}] ` : ''} ${error as string}`,
      'error'
    );
  }
};
