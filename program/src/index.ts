import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';

import { ILauncher } from '@jupyterlab/launcher';

import {
  Widget,
  BoxPanel,
  DockPanel
} from '@lumino/widgets';

import {
  Message
} from '@lumino/messaging';

import '../style/index.css';

/**
 * The command IDs used by the server extension plugin.
 */
namespace CommandIDs {
  export const get = 'server:get-program';
}
  

class ContentWidget extends Widget {

  static createNode(): HTMLElement {
    let node = document.createElement('div');
    let content = document.createElement('div');
	let packrat = document.createTextNode("Packrat"); 
    let input = document.createElement('input');
    input.placeholder = '3319382';
	content.appendChild(packrat);
    content.appendChild(input);
    node.appendChild(content);
    return node;
  }

  constructor(name: string) {
    super({ node: ContentWidget.createNode() });
    this.setFlag(Widget.Flag.DisallowLayout);
    this.addClass('content');
    this.addClass(name.toLowerCase());
    this.title.label = name;
    this.title.closable = true;
    this.title.caption = `Long description for: ${name}`;
  }

  get inputNode(): HTMLInputElement {
    return this.node.getElementsByTagName('input')[0] as HTMLInputElement;
  }

  protected onActivateRequest(msg: Message): void {
    if (this.isAttached) {
      this.inputNode.focus();
    }
  }
}

/**
 * Initialization data for the @webds/program extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: '@webds/program:plugin',
  autoStart: true,
  optional: [ILauncher],
  requires: [ICommandPalette],
  activate: async (app: JupyterFrontEnd,
    palette: ICommandPalette,
    launcher: ILauncher | null
  ) => {
    console.log('JupyterLab extension @webds/program is activated!');

	const { commands, shell } = app;
    const command = CommandIDs.get;
    const category = 'WebDS';

    commands.addCommand(command, {
      label: 'Program',
      caption: 'Erase & Program',
      execute: async () => {

		let dock = new DockPanel();
		dock.id = 'dock';

        let packrat = new ContentWidget('Packrat');
        let choose = new ContentWidget('ChooseHEX');

        let box = new BoxPanel({ direction: 'left-to-right', spacing: 0 });
		box.id = "program box";


		dock.addWidget(packrat);
		dock.addWidget(choose, { ref: packrat });

		box.addWidget(dock);
        
		shell.add(box, 'main');
      }
    });

	palette.addItem({ command, category: category });

    if (launcher) {
      // Add launcher
      launcher.add({
        command: command,
        category: category
      });
    }
	
	
  }
};

export default extension;
