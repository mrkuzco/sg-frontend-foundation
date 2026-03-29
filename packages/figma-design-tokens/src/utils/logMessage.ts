/* eslint-disable no-console */
import chalk from 'chalk';

export const logMessage = (
  message: string,
  type?: 'warning' | 'success' | 'info' | 'error' | 'log'
) => {
  switch (type) {
    case 'success':
      console.info(chalk.green(message));
      return;
    case 'warning':
      console.warn(chalk.yellow(message));
      return;
    case 'error':
      console.error(chalk.red(message));
      return;
    case 'log':
      console.log(message);
      return;
    // Default to info
    case 'info':
    default:
      console.info(chalk.blue(message));
  }
};
