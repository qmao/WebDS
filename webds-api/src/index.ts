import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { requestAPI } from './handler';

/**
 * Initialization data for the @webds/webds-api extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: '@webds/webds-api:plugin',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension @webds/webds-api is activated!');

    requestAPI<any>('general')
      .then(data => {
        console.log(data);
      })
      .catch(reason => {
        console.error(
          `The webds-api server extension appears to be missing.\n${reason}`
        );
      });
  }
};

export default extension;
