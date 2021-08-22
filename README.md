# Description
Parse a SAP `mta.yaml` file and generates a `mta.svg` file representing the modules, resources and relationships between them.

Examples of generated files:

![solutions-mta](https://user-images.githubusercontent.com/51169423/130364774-1d9fe0a3-ec56-44a1-98c0-90dd1e3fa5ba.png)

![bookshop-demo-mta-cf](https://user-images.githubusercontent.com/51169423/130364878-baa5af09-3d96-449f-ad72-f97cc4fbbbc4.png)

![hana-opensap-cloud-mta](https://user-images.githubusercontent.com/51169423/130364915-b1c3c1c7-11c1-478e-baf8-529cdf328288.png)

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
