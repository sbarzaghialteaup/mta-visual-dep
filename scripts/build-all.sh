cd ../mta-deps-parser/ && npm run build && npm link
cd ../mta-deps-graphviz/ && npm link mta-deps-parser && npm run build && npm link
npm link mta-deps-parser mta-deps-graphviz

npm ls