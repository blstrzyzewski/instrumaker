# project/test_basic.py


import os
import unittest

from app import app


class RouteTests(unittest.TestCase):

    ############################
    #### setup and teardown ####
    ############################

    # executed prior to each test
    def setUp(self):
        app.config["TESTING"] = True
        app.config["WTF_CSRF_ENABLED"] = False
        app.config["DEBUG"] = False

        self.app = app.test_client()

        self.assertEqual(app.debug, False)

    def melody(self, key, tempoMin, tempoMax, fixed):
        return self.app.get(
            "/audioOptions",
            query_string=dict(
                key=key, tempoMin=tempoMin, tempoMax=tempoMax, fixed=fixed
            ),
            follow_redirects=True,
        )

    # executed after each test
    def tearDown(self):
        pass

    ###############
    #### tests ####
    ###############

    def test_main_page(self):
        response = self.app.get("/", follow_redirects=True)
        self.assertEqual(response.status_code, 200)

    def test_melody(self):
        # test random
        response = self.melody("", "110", "150", "0")
        self.assertEqual(response.status_code, 200)
        self.assertIn("key", response.headers)
        self.assertIn("tempo", response.headers)
        # test fixed
        response = self.melody("Gb", "138", "138", "1")
        self.assertEqual(response.status_code, 200)
        self.assertIn("key", response.headers)
        self.assertIn("tempo", response.headers)

    def test_drums(self):
        response = self.app.get("/getDrums", query_string=dict(key="Bb", tempo="123"))
        self.assertEqual(response.status_code, 200)


if __name__ == "__main__":
    unittest.main()