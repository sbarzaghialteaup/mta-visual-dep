# Description
Parse a SAP `mta.yaml` file using the [`mta-deps-parser`](https://www.npmjs.com/package/mta-deps-parser) package and the [`mta-deps-graphviz`](https://www.npmjs.com/package/mta-deps-graphviz) package to generate a `mta.svg` file representing the modules, resources and relationships between them.

This is an example of a generated `mta.svg` file:

![image](https://user-images.githubusercontent.com/51169423/127784448-30d7889c-edca-44a4-98f3-26b8f7714434.png)

Full svg available [here](https://raw.githubusercontent.com/sbarzaghialteaup/mta-visual-dep/master/mta.svg)

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

The tool creates the mta.svg file and log on console the moment of the update:
```
File mta.svg updated at Sat Aug 07 2021 18:13:25 GMT+0200 (Central European Summer Time)
```