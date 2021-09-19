#! /bin/bash
cd ../mta-deps-parser/ && npm link
cd ../mta-deps-graphviz/ && npm link mta-deps-parser && npm link
npm link mta-deps-parser mta-deps-graphviz

npm ls
