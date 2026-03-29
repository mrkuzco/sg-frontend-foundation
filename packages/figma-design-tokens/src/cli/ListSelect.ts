import rl from 'readline'; // NodeJS built-in module
import chalk from 'chalk';

/**
 * Heavily inspired by
 * https://github.com/DmitryBogomolov/cli-list-select/tree/master
 * with some modernization and TypeScript support.
 * License is MIT at the time of taking inspiration.
 */

const inputStream = process.stdin;
const outputStream = process.stdout;

const CTRL_C = '\u0003';

rl.emitKeypressEvents(inputStream);

class ListSelect {
  private items: string[];
  private currentIndex: number;
  private checkMap: Set<number>;
  private lineCount: number;

  constructor(items: string[], index: number = 0, checks: number[] = []) {
    this.items = items;
    this.currentIndex = this.verifyIndex(index) ? index : 0;
    this.checkMap = new Set<number>(checks);
    this.lineCount = 0;
  }

  private verifyIndex(value: number): boolean {
    return 0 <= value && value < this.items.length;
  }

  private renderList(): number {
    let lineCount = 0;
    this.items.forEach((item, i) => {
      const isFocused = i === this.currentIndex;
      const isChecked = this.checkMap.has(i);
      const prefix = `${isFocused ? chalk.blue('>') : ' '}[${isChecked ? chalk.green('*') : ' '}] `;
      const line = isFocused ? chalk.bold(item) : item;
      outputStream.write(`${prefix}${line}\n`);
      lineCount++;
    });
    return lineCount;
  }

  private clearList(subtractPreviousLineCount: number = 0) {
    for (let i = 0; i < this.lineCount + subtractPreviousLineCount; ++i) {
      rl.moveCursor(outputStream, 0, -1);
      rl.clearLine(outputStream, 0);
    }
  }

  private refresh() {
    this.clearList();
    this.lineCount = this.renderList();
  }

  private setIndex(newIndex: number) {
    // Allow arrow up to go to the last item when on the first item.
    if (newIndex === -1) {
      this.setIndex(this.items.length - 1);
      return;
    }

    // Allow arrow down to go to the first item when on the last item.
    if (newIndex === this.items.length) {
      this.setIndex(0);
      return;
    }

    // Only set the index if it's different from the current index and it's valid.
    if (newIndex !== this.currentIndex && this.verifyIndex(newIndex)) {
      this.currentIndex = newIndex;
      this.refresh();
    }
  }

  private toggleCheck(newIndex: number) {
    if (this.verifyIndex(newIndex)) {
      if (this.checkMap.has(newIndex)) {
        this.checkMap.delete(newIndex);
      } else {
        this.checkMap.add(newIndex);
      }
      this.refresh();
    }
  }

  public render({
    onSelectClearNumberOfPreviousLines,
  }: {
    onSelectClearNumberOfPreviousLines?: number;
  } = {}): Promise<{ index: number; checks: number[] }> {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const onHandleKeyEvent = (_key: unknown, data: any) => {
        if (data.sequence === CTRL_C) {
          dispose();
          reject(new Error('Operation canceled by user'));
          return;
        }

        switch (data.name) {
          case 'up':
            this.setIndex(this.currentIndex - 1);
            break;
          case 'down':
            this.setIndex(this.currentIndex + 1);
            break;
          case 'space':
            this.toggleCheck(this.currentIndex);
            break;
          case 'return':
            end(this);
            break;
        }
      };

      function dispose() {
        inputStream.off('keypress', onHandleKeyEvent);
        inputStream.setRawMode(false);
      }

      function end(instance: ListSelect) {
        dispose();
        instance.clearList(onSelectClearNumberOfPreviousLines);
        resolve({
          index: instance.currentIndex,
          checks: Array.from(instance.checkMap).sort(),
        });
      }

      inputStream.setRawMode(true);
      inputStream.on('keypress', onHandleKeyEvent);
      this.lineCount = this.renderList();
    });
  }
}

export default ListSelect;
