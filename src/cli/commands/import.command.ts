import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import chalk from 'chalk';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public execute(...parameters: string[]): void {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());
    const errorStyle = chalk.red;
    try {
      fileReader.read();
      console.log(fileReader.toArray());
    } catch (err) {
      if (!(err instanceof Error)) {
        throw err;
      }

      console.error(errorStyle(`Can't import data from file: ${filename}`));
      console.error(errorStyle(`Details: ${err.message}`));
    }
  }
}
