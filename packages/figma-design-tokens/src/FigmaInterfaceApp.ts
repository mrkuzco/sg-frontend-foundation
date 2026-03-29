/* eslint-disable no-console */
import chalk from 'chalk';
import ListSelect from './cli/ListSelect';

export class FigmaInterfaceApp<
  T extends { appName: string; generate: () => void },
> {
  private apps: T[];
  private selectedApps: T[] = [];

  public constructor(apps: T[]) {
    this.apps = apps;
  }

  /**
   * @description Display a list of apps to select from, then run a `generate` method on the selected apps.
   */
  public async run() {
    try {
      const selectedIndexes = await this.renderList();
      this.selectedApps = selectedIndexes.map((i) => this.apps[i]);

      if (this.selectedApps.length === 0) {
        console.log(chalk.yellow('No apps selected. Exiting...'));
        return;
      }

      const appNames = this.selectedApps.map((app) => app.appName).join(', ');
      console.log(`${chalk.bold('Selected apps:')} ${appNames}`);

      // Run the `generate` method on the selected apps in parallel.
      const results = await this.parallelGenerate();

      // Render the results.
      console.log('----------------------------------------');
      this.renderResults(results);
    } catch (error) {
      // Render the error message and reject the promise.
      this.renderError((error as Error)?.message ?? String(error));
      // eslint-disable-next-line
      return Promise.reject(error);
    } finally {
      // Always exit the app.
      await this.exit(0);
    }
  }

  private async renderList() {
    const items = this.apps.map((app) => app.appName);
    console.log(chalk.bold(chalk.blue('Select item(s):')));

    const { checks: selectedIndexes } = await new ListSelect(items).render({
      onSelectClearNumberOfPreviousLines: 1, // Removes the `Select item(s):` line
    });

    return selectedIndexes;
  }

  private async parallelGenerate() {
    const promises = this.selectedApps.map((app) => app.generate());
    return Promise.allSettled(promises);
  }

  private renderResults(results: PromiseSettledResult<void>[]) {
    for (const index in results) {
      const result = results[index];
      const { appName } = this.selectedApps[index];
      if (result.status === 'fulfilled') {
        console.log(chalk.green(`[${appName}] Generated successfully.`));
      } else {
        this.renderError(`[${appName}] Failed to generate: ${result.reason}`);
      }
    }
  }

  private renderError(errorMessage: string) {
    const styledMessage =
      chalk.bgRed.white.bold(` ERROR `) + ' ' + chalk.redBright(errorMessage);
    console.log(styledMessage);
  }

  /**
   * @description This method exits the app.
   * @param exitCode The exit code to use when exiting the app. Defaults to 0 (success).
   */
  public async exit(exitCode: number = 0) {
    // Wait for 1 second before exiting the app to allow any potential file operations to finish.
    console.log(chalk.bold('Exiting...'));
    setTimeout(() => process.exit(exitCode), 1000);
  }
}
