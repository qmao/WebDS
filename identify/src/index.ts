import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { requestAPI } from './handler';

import { ICommandPalette } from '@jupyterlab/apputils';

import { ILauncher } from '@jupyterlab/launcher';

import { StackedPanel } from '@lumino/widgets';

import { identifyIcon } from './icons';

/**
 * The command IDs used by the server extension plugin.
 */
namespace CommandIDs {
  export const get = 'server:get-file';
}

/**
 * Initialization data for the @webds/identify extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: '@webds/identify:plugin',
  autoStart: true,
  optional: [ILauncher],
  requires: [ICommandPalette],
  activate: async (app: JupyterFrontEnd,
    palette: ICommandPalette,
    launcher: ILauncher | null
  ) => {
    console.log('JupyterLab extension @webds/identify is activated!');

	const { commands, shell } = app;
    const command = CommandIDs.get;
    const category = 'WebDS';

    commands.addCommand(command, {
      label: 'Identify',
      caption: 'Identify Widget',
	  icon: identifyIcon,
      execute: async () => {
        const widget = new StackedPanel();
		widget.id = 'identify';
		widget.title.label = 'Identify';
		widget.title.closable = true;

        shell.add(widget, 'main');

		requestAPI<any>('identify')
          .then(data => {
          console.log(data);

		  const textarea = document.createTextNode(JSON.stringify(data));
		  
          widget.node.appendChild(textarea);
        })
        .catch(reason => {
          console.error(
            `The identify server extension appears to be missing.\n${reason}`
          );
        });
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
