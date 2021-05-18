import json

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado

import numpy as np
import sys
sys.path.append('/usr/local/syna/python')
from touchcomm import TouchComm

tc = None
print("[WebDS] handler is running!")


def touchcomm_init():
    global tc

    if (tc == None):
        print("going to create tc!!");
        tc = TouchComm.make(protocols='report_streamer', server='127.0.0.1', packratCachePath='/usr/local/syna/cache/packrat', streaming=False)
        tc.reset()
        identify = tc.identify()
        print(identify)
        print("tc is created!");

class GeneralHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self):
        print("GENERAL GET REQUEST");
        touchcomm_init()
        if (tc):
            self.finish(json.dumps({"data": "TouchComm object is created"}))
        else:
            self.finish(json.dumps({"data": "TouchComm object create failed"}))

class ReportHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self):
        print("REPORT GET REQUEST");
        global tc
        touchcomm_init()
        # enable touch report
        tc.disableReport(17)
        tc.enableReport(18)

        self.finish(json.dumps({
            "data": "This is /webds-api/get_report endpoint!"
        }))

    @tornado.web.authenticated
    def post(self):
        ### print("REPORT POST IS ACTIVED");
        # input_data is a dictionary with a key "name"
        input_data = self.get_json_body()

        global tc
        touchcomm_init()

        image = [ [0] * 37 for _ in range(19) ]
        image = np.asarray(image)
        report = tc.getReport()
        ### print(report)
        if ('delta' in report):
            image = report[1]['image']
            ##print(image)
            lists = image.flatten().tolist()
            ##print(lists)
            data = lists

        ## print(data)

        self.finish(json.dumps(data))

class IdentifyHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self):
        print("IDENTIFY GET REQUEST");
        global tc
        identify = tc.identify()
        print(identify)
        self.finish(json.dumps(identify))

def setup_handlers(web_app):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]
    report_pattern = url_path_join(base_url, "webds-api", "get-report")
    general_pattern = url_path_join(base_url, "webds-api", "general")
    identify_pattern = url_path_join(base_url, "webds-api", "identify")
    handlers = [(general_pattern, GeneralHandler), (report_pattern, ReportHandler), (identify_pattern, IdentifyHandler)]
    web_app.add_handlers(host_pattern, handlers)
