import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { requestAPI } from './handler';

import { ICommandPalette } from '@jupyterlab/apputils';

import { ILauncher } from '@jupyterlab/launcher';

import { StackedPanel, Widget } from '@lumino/widgets';

import { identifyIcon } from './icons';

import {
  BasicSelectionModel, DataGrid, JSONModel
} from '@lumino/datagrid';

/**
 * The command IDs used by the server extension plugin.
 */
namespace CommandIDs {
  export const get = 'server:get-file';
}
  
  
function createWrapper(content: Widget, title: string): Widget {
  let wrapper = new StackedPanel();
  wrapper.addClass('content-wrapper');
  wrapper.addWidget(content);
  wrapper.title.label = title;
  wrapper.title.closable = true;
  
  return wrapper;
}
  
namespace Data {

  export
  const identify = {
    "data": [
      {
        "packetVer": 0,
        "mode": "?????",
		"partNumber": "????",
		"buildID": 0,
		"maxWriteBytes": 0,
      },
    ],
    "schema": {
      "primaryKey": [
        "index"
      ],
      "fields": [
        {
          "name": "packetVer",
          "type": "string"
        },
      ],
      "pandas_version": "0.20.0"
    }
  }
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

		requestAPI<any>('identify')
          .then(data => {
          console.log(data);

		  ////const textarea = document.createTextNode(JSON.stringify(data));
		  
          ////widget.node.appendChild(textarea);
		  

		console.log(Data.identify);

		let myData = Data.identify;
		myData.data[0] = data;
		
		//console.log(myData);
		
		let model5 = new JSONModel(Data.identify);

		let grid5 = new DataGrid({
		  defaultSizes: {
			rowHeight: 32,
			columnWidth: 128,
			rowHeaderWidth: 64,
			columnHeaderHeight: 32
		  }
		});
		grid5.dataModel = model5;
		grid5.selectionModel = new BasicSelectionModel({
		  dataModel: model5,
		  selectionMode: 'row'
		});
	
		  let wrapper5 = createWrapper(grid5, 'JSON DATA');
          wrapper5.id = 'Identify';
          shell.add(wrapper5, 'main');
  
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
