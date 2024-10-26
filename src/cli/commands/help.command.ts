import { Command } from './command.interface.js';
import chalk from 'chalk';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(`
      Программа для подготовки данных для REST API сервера.

      Пример: ${chalk.yellowBright('cli.js --<command> [--arguments]')}

      Команды:

      ${chalk.yellowBright('--version')}:                   # выводит номер версии
      ${chalk.yellowBright('--help')}:                      # печатает этот текст
      ${chalk.yellowBright('--import <path>')}:             # импортирует данные из TSV
      ${chalk.yellowBright('--generate <n> <path> <url>')}  # генерирует произвольное количество тестовых данных
    `);
  }
}
