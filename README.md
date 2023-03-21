This tool is used to find genes found in a location from Alliance Member JBrowse instances.

```
Usage: index [options]

      _ ____                               _   _  ____ _     _     _   
     | | __ ) _ __ _____      _____  ___  | \ | |/ ___| |   (_)___| |_ 
  _  | |  _ \| '__/ _ \ \ /\ / / __|/ _ \ |  \| | |   | |   | / __| __|
 | |_| | |_) | | | (_) \ V  V /\__ \  __/ | |\  | |___| |___| \__ \ |_ 
  \___/|____/|_|  \___/ \_/\_/ |___/\___| |_| \_|\____|_____|_|___/\__|
                                                                       
A wrapper around gmod/nclist-js. It returns JSON for generating cross references to JBrowse features

Options:
  -V, --version           output the version number
  -b, --baseurl  <value>  Path to JBrowse Data Directory - base URL for resolving relative URLs
  -t, --template <value>  URL Template
  -r, --refseq <value>    The Sequence name
  -s, --start <integer>   start position
  -e, --end <integer>     end position
  -v, --verbose           For debuging purposes
  -h, --help              display help for command
```

Requirements:
- node


## Install node_modules

get the node_module dependencies

``` bash
npm install
```

## Compile CLI

create dist/index.js file to be run by node

```bash
npx tsc
```

## Run the tool

```bash
node dist/index.js --help
```


Example command: 
```
node dist/index.js -b "https://s3.amazonaws.com/agrjbrowse/MOD-jbrowses/WormBase/WS286/c_elegans_PRJNA13758/" -t "tracks/Curated_Genes/{refseq}/trackData.jsonz" -s 5692675 -e 5692315 -r III
```

# Install with NPM

```bash
npm i jbrowse-nclist-cli -g
```
