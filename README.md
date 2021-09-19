# Description
This tool parses a SAP `mta.yaml` file and generates a `mta.svg` file representing the modules, resources, properties, destinations and relationships between them.

## Examples of generated files

CAP Bookshop Demo
![CAP Bookshop Demo](https://raw.githubusercontent.com/sbarzaghialteaup/mta-visual-dep/master/generated-samples/bookshop-demo-mta-cf.svg)

HANA Cloud 2020 openSAP example
![HANA-CLOUD-SAMPLES](https://raw.githubusercontent.com/sbarzaghialteaup/mta-visual-dep/master/generated-samples/hana-opensap-cloud-mta.svg)

Fiori App with approuter managed
![Fiori App Approuter Managed](https://raw.githubusercontent.com/sbarzaghialteaup/mta-visual-dep/master/generated-samples/mta-fiori-app-approuter-managed.svg)

CAP Multitenant
![CAP Multitenant](https://raw.githubusercontent.com/sbarzaghialteaup/mta-visual-dep/master/generated-samples/mta-cap-mtx.svg)

Developer Keynote Dashboard UI
![Developer Keynote Dashboard UI](https://raw.githubusercontent.com/sbarzaghialteaup/mta-visual-dep/master/generated-samples/mta-teched-2020-ui.svg)

CAP Service
![CAP Service](https://raw.githubusercontent.com/sbarzaghialteaup/mta-visual-dep/master/generated-samples/optional-self-host-cap.svg)

CAP Service with Fiori Apps
![Solutions](https://raw.githubusercontent.com/sbarzaghialteaup/mta-visual-dep/master/generated-samples/solutions-mta.svg)

## Installation

Install globally with:
```
> npm install -g mta-visual-dep
```

## Usage

Run the `mta-visual-dep` command in the folder containing the mta.yaml file:

```
> mta-visual-dep
```

The tool creates the mta.svg file in the current folder

## Notes
Internally use the [`mta-deps-parser`](https://www.npmjs.com/package/mta-deps-parser) package to parse and the [`mta-deps-graphviz`](https://www.npmjs.com/package/mta-deps-graphviz) package to generate the svg file.
