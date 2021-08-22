# Description
Parse a SAP `mta.yaml` file and generates a `mta.svg` file representing the modules, resources and relationships between them.

This is an example of a generated `mta.svg` file:

![mta](https://user-images.githubusercontent.com/51169423/129454822-ed9f1509-e131-484f-8951-071dd85ff647.png)

# Installation

You can install as a tool in path with:
```
npm install -g mta-visual-dep
```

# Usage

Run the `mta-visual-dep` command in the folder containing the mta.yaml file, no options yet, more to come!

```
mta-visual-dep
```

The tool creates the mta.svg file and log to console the moment of the update:
```
File mta.svg updated at Sat Aug 07 2021 18:13:25 GMT+0200 (Central European Summer Time)
```

# Notes
Internally use the [`mta-deps-parser`](https://www.npmjs.com/package/mta-deps-parser) package to parse and the [`mta-deps-graphviz`](https://www.npmjs.com/package/mta-deps-graphviz) package to generate the svg file.
