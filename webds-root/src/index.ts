import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';

import { ILauncher } from '@jupyterlab/launcher';

import {
  Menu,
  MenuBar,
  CommandPalette,
  BoxPanel,
  StackedPanel,
  BoxLayout
} from '@lumino/widgets';

/**
 * The command IDs used by the server extension plugin.
 */
namespace CommandIDs {
  export const get = 'webds:get-root';
}


/**
 * Initialization data for the @webds/webds-root extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: '@webds/webds-root:plugin',
  autoStart: true,
  optional: [ILauncher],
  requires: [ICommandPalette],
  activate: async (app: JupyterFrontEnd,
    palette: ICommandPalette,
    launcher: ILauncher | null
  ) => {
    console.log('JupyterLab extension @webds/webds-root is activated!');


	const { commands, shell } = app;
    const command = CommandIDs.get;
    const category = 'WebDS';
	
    commands.addCommand(command, {
      label: 'WebDS-Demo',
      caption: 'WebDS Demo',
      execute: async () => {
        
      let sub_on = new Menu({ commands });
      sub_on.title.label = 'On...';
      sub_on.title.mnemonic = 0;
      sub_on.addItem({ command: 'example:power-on' });
		
      let sub_off = new Menu({ commands });
      sub_off.title.label = 'Off...';
      sub_off.title.mnemonic = 0;
      sub_off.addItem({ command: 'example:power-off' });		

      let sub2 = new Menu({ commands });
      sub2.title.label = 'Power...';
      sub2.title.mnemonic = 0;
      sub2.addItem({ command: 'example:delta image' });
      sub2.addItem({ command: 'example:raw image' });
      sub2.addItem({ type: 'submenu', submenu: sub_on });
      sub2.addItem({ type: 'submenu', submenu: sub_off });
  
      let menu1 = new Menu({ commands });
      menu1.addItem({ command: 'webds:identify' });
      menu1.addItem({ type: 'separator' });
      menu1.addItem({ command: 'example:reset' });
      menu1.addItem({ type: 'separator' });
      menu1.addItem({ type: 'submenu', submenu: sub2 });
      menu1.addItem({ type: 'separator' });

      menu1.title.label = 'Genral';
      menu1.title.mnemonic = 0;
  

      let bar = new MenuBar();
      bar.addMenu(menu1);
      bar.id = 'menuBar';
  


      let my_palette = new CommandPalette({ commands });
      my_palette.addItem({ command: 'webds:identify', category: 'Edit' });
      my_palette.addItem({ command: 'webds:diagnostics', category: 'Edit' });
      my_palette.id = 'my_palette';
		
      my_palette.addItem({
			command: 'save-dock-layout',
			category: 'Dock Layout',
			rank: 0
		});
  
		
      let main_panel = new StackedPanel();
	  main_panel.id = 'webds-main'
	  
      let box_panel = new BoxPanel({ direction: 'top-to-bottom', spacing: 0 });
      box_panel.id = 'webds-root';

      box_panel.addWidget(bar);
      box_panel.addWidget(my_palette);

	  BoxLayout.setStretch(bar, 0);
 
      console.log(main_panel);

      shell.add(box_panel, 'main');
      }
    });
	
	// --- command implementations ----
	commands.addCommand('example:identify', {
      label: 'Identify',
      mnemonic: 0,
      caption: 'Identify Test',
      execute: () => {
        console.log('Identify');
      }
    });
	
	commands.addCommand('example:reset', {
      label: 'Reset',
      mnemonic: 0,
      caption: 'Reset Test',
      execute: () => {
        console.log('Reset');
      }
    });
	
    commands.addCommand('example:command-test-1', {
      label: 'command-test-1',
      mnemonic: 0,
      caption: 'command-test-1',
      execute: () => {
        console.log('command-test-1');
      }
    });
	
	commands.addCommand('example:command-test-2', {
      label: 'command-test-2',
      mnemonic: 0,
      caption: 'command-test-2',
      execute: () => {
        console.log('command-test-2');
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

