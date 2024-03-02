export type Log = {
    logId: string;
    fileName: string;
    description: string;
    uploadTime: number;
    firstLogTime: number;
    lastLogTime: number;
    isProcessed: boolean;
    lines: number;
    size: string;
  };